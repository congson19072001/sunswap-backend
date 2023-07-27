import { Injectable } from '@nestjs/common';
import { providers, Wallet, BigNumber } from "ethers";
import { 
    SunSwapFactory__factory, 
    SunSwapFactory, 
    SunSwapPair,
    SunSwapPair__factory,
    SunSwapERC20,
    SunSwapERC20__factory,
    SunswapRouter02__factory,
    SunswapRouter02,

} from "../../typechain-types";
import { BigNumber as BigNumberJs } from 'bignumber.js';
import * as bnbContract from "../../shared/bsc_contracts.json";
import * as polygonContract from "../../shared/polygon_contracts.json";
import { getLogger } from '../../shared/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { PairStatus, Token, TokenPair, TokenStatus } from '../../database/entities';
import { MongoRepository } from 'typeorm';
const logger = getLogger('CommonService');

@Injectable()
export class CommonService {
    private signers: {
        [network: number]: Wallet;
    } = {};
    private factories: {
        [network: number]: SunSwapFactory;
    } = {};
    private routers: {
        [network: number]: SunswapRouter02;
    } = {};
    private curPairs: {
        [network: number]: {
            [address: string]: SunSwapPair;
        }
    } = {};
    private curTokens: {
        [network: number]: {
            [address: string]: SunSwapERC20;
        }
    } = {};
    constructor(
        @InjectRepository(TokenPair)
        private pairsRepository: MongoRepository<TokenPair>,

        @InjectRepository(Token)
        private tokensRepository: MongoRepository<Token>,

        @InjectRepository(PairStatus)
        private pairStatusRepository: MongoRepository<PairStatus>,

        @InjectRepository(TokenStatus)
        private tokenStatusRepository: MongoRepository<TokenStatus>,
    ) { 
        // Initialize providers
        const bnbProvider = new providers.JsonRpcProvider(process.env.BSC_RPC);
        this.signers[97] = new Wallet(
            `${process.env.PRIVATE_KEY}`,
            bnbProvider,
        );
        const bnbFactoryFac: SunSwapFactory__factory = new SunSwapFactory__factory(this.signers[97]);
        this.factories[97] = bnbFactoryFac.attach(bnbContract.SUNSWAP_FACTORY);
        const bnbRouterFac: SunswapRouter02__factory = new SunswapRouter02__factory(this.signers[97]);
        this.routers[97] = bnbRouterFac.attach(bnbContract.SUNSWAP_ROUTER);

        const polygonProvider = new providers.JsonRpcProvider(process.env.POLYGON_RPC);
        this.signers[80001] = new Wallet(
            `${process.env.PRIVATE_KEY}`,
            polygonProvider,
        );    
        const polygonFactoryFac: SunSwapFactory__factory = new SunSwapFactory__factory(this.signers[80001]);
        this.factories[80001] = polygonFactoryFac.attach(polygonContract.SUNSWAP_FACTORY);
        const polygonRouterFac: SunswapRouter02__factory = new SunswapRouter02__factory(this.signers[80001]);
        this.routers[80001] = polygonRouterFac.attach(polygonContract.SUNSWAP_ROUTER);
    }

    async savePairStatus(network: number, address: string, token0: string, token1: string, reserve0: BigNumber, reserve1: BigNumber, decimals0: number, decimals1: number, timestamp: number) {
        const pairStatus = new PairStatus();
        pairStatus.network = network;
        pairStatus.address = address;
        pairStatus.token0 = token0;
        pairStatus.token1 = token1;
        pairStatus.reserve0 = reserve0.toString();
        pairStatus.reserve1 = reserve1.toString();
        pairStatus.decimals0 = decimals0;
        pairStatus.decimals1 = decimals1;
        let ratio = new BigNumberJs(reserve1.mul(decimals1).toString());
        ratio = ratio.div(reserve0.mul(decimals0).toString());
        pairStatus.ratio = ratio.toString();
        pairStatus.timestamp = timestamp;
        await this.pairStatusRepository.save(pairStatus);
    }

    async saveTokenStatus(network: number, address: string, reserve: BigNumber, timestamp: number) {
        const tokenStatus = new TokenStatus();
        tokenStatus.network = network;
        tokenStatus.address = address;
        tokenStatus.reserve = reserve.toString();
        tokenStatus.timestamp = timestamp;
        await this.tokenStatusRepository.save(tokenStatus);
    }

    async getPair(network: number, from: string, to: string) {
        if(!this.factories[network]){
            return null;
        }
        return await this.factories[network].getPair(from, to);
    }

    async updatePairAndTokenList(network: number) {
        let fullyLoaded = false;
        let i = 0;
        while (!fullyLoaded) {
            try {
                const pair = await this.factories[network].allPairs(i);
                let existingPair = await this.pairsRepository.findOne({
                    where: {
                        network: network,
                        address: pair
                    }
                });
                if(!existingPair) {
                    existingPair = await this.createNewPairAndIncludedTokens(network, pair);
                    logger.info(existingPair);
                }
                
                i++;
            } catch (error) {
                fullyLoaded = true;
            }
        }
    }

    async getPairStatuses(pair: TokenPair) {
        if(!this.curPairs[pair.network]){
            this.curPairs[pair.network] = {};
        }
        let pairFactory: SunSwapPair = this.curPairs[pair.network][pair.address];
        if(!pairFactory) {
            const pairFac: SunSwapPair__factory = new SunSwapPair__factory(this.signers[pair.network]);
            pairFactory = pairFac.attach(pair.address);
            this.curPairs[pair.network][pair.address] = pairFactory;
        }
        try{
            const reserves = await pairFactory.getReserves();
            await this.savePairStatus(pair.network, pair.address, pair.token0, pair.token1, reserves._reserve0, reserves._reserve1, pair.decimals0, pair.decimals1, Math.floor(Date.now()));
        } catch (error) {
            logger.error(error);
        }
    }

    async getTokenStatuses(token: Token) {
        if(!this.curTokens[token.network]){
            this.curTokens[token.network] = {};
        }
        let tokenFactory: SunSwapERC20 = this.curTokens[token.network][token.address];
        if(!tokenFactory) {
            const tokenFac: SunSwapERC20__factory = new SunSwapERC20__factory(this.signers[token.network]);
            tokenFactory = tokenFac.attach(token.address);
            this.curTokens[token.network][token.address] = tokenFactory;
        }
        try{
        const reserves = await tokenFactory.totalSupply();
        await this.saveTokenStatus(token.network, token.address, reserves, Math.floor(Date.now()));
        } catch (error) {
            logger.error(error);
        }
    }

    async createNewPairAndIncludedTokens(network: number, pair: string) {
        let newPair: TokenPair;
        if(!this.curPairs[network]){
            this.curPairs[network] = {};
        }
        let pairFactory: SunSwapPair = this.curPairs[network][pair];
        if(!pairFactory) {
            const pairFac: SunSwapPair__factory = new SunSwapPair__factory(this.signers[network]);
            pairFactory = pairFac.attach(pair);
            this.curPairs[network][pair] = pairFactory;
        }
        try {     
            newPair = new TokenPair();
            newPair.network = network;
            newPair.address = pair;
            newPair.token0 = await pairFactory.token0();
            newPair.token1 = await pairFactory.token1();
            const token0 = await this.createTokenFromAddressAndNetwork(newPair.token0, network);
            const token1 = await this.createTokenFromAddressAndNetwork(newPair.token1, network);
            newPair.name0 = token0.name;
            newPair.name1 = token1.name;
            newPair.decimals0 = token0.decimals;
            newPair.decimals1 = token1.decimals;
            await this.pairsRepository.save(newPair);
            return newPair;
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    /**
     * Creates a token from the given address and network.
     *
     * @param {string} address - The address of the token.
     * @param {number} network - The network on which the token exists.
     * @return {Promise<Token>} The created token.
     */
    async createTokenFromAddressAndNetwork(address: string, network: number) {
        const token = await this.tokensRepository.findOne({
            where: {
                network,
                address
            }
        });
        if(!token) {
            if(!this.curTokens[network]){
                this.curTokens[network] = {};
            }
            let tokenFactory: SunSwapERC20 = this.curTokens[network][address];
            if(!tokenFactory) {
                const tokenFac: SunSwapERC20__factory = new SunSwapERC20__factory(this.signers[network]);
                tokenFactory = tokenFac.attach(address);
                this.curTokens[network][address] = tokenFactory;
            }
            try{
                const newToken = new Token();
                newToken.network = network;
                newToken.address = address;
                newToken.symbol = await tokenFactory.symbol();
                newToken.name = await tokenFactory.name();
                newToken.decimals = await tokenFactory.decimals();
                await this.tokensRepository.save(newToken);
                return newToken;
            } catch (error) {
                logger.error(error);
                return null;
            }
        }
        return token;
    }
}
