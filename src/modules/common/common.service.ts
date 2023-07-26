import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from "@nestjs/schedule";
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
    private bnbSigner: Wallet;
    private polygonSigner: Wallet;
    private bnbFactory: SunSwapFactory;
    private polygonFactory: SunSwapFactory;
    private bnbRouter: SunswapRouter02;
    private polygonRouter: SunswapRouter02;
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
        this.bnbSigner = new Wallet(
            `${process.env.PRIVATE_KEY}`,
            bnbProvider,
        );
        const bnbFactoryFac: SunSwapFactory__factory = new SunSwapFactory__factory(this.bnbSigner);
        this.bnbFactory = bnbFactoryFac.attach(bnbContract.SUNSWAP_FACTORY);
        const bnbRouterFac: SunswapRouter02__factory = new SunswapRouter02__factory(this.bnbSigner);
        this.bnbRouter = bnbRouterFac.attach(bnbContract.SUNSWAP_ROUTER);

        const polygonProvider = new providers.JsonRpcProvider(process.env.POLYGON_RPC);
        this.polygonSigner = new Wallet(
            `${process.env.PRIVATE_KEY}`,
            polygonProvider,
        );    
        const polygonFactoryFac: SunSwapFactory__factory = new SunSwapFactory__factory(this.polygonSigner);
        this.polygonFactory = polygonFactoryFac.attach(polygonContract.SUNSWAP_FACTORY);
        const polygonRouterFac: SunswapRouter02__factory = new SunswapRouter02__factory(this.polygonSigner);
        this.polygonRouter = polygonRouterFac.attach(polygonContract.SUNSWAP_ROUTER);
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

    async updatePairAndTokenList(network: number) {
        let factory: SunSwapFactory;
        let signer: Wallet;
        switch (network) {
            case 80001:
                factory = this.polygonFactory;
                signer = this.polygonSigner;
                break;
            case 97:
                factory = this.bnbFactory;
                signer = this.bnbSigner;
                break;
            default:
                factory = this.polygonFactory;
                signer = this.polygonSigner;
                break;
        }
        let fullyLoaded = false;
        let i = 0;
        while (!fullyLoaded) {
            try {
                const pair = await factory.allPairs(i);
                let existingPair = await this.pairsRepository.findOne({
                    where: {
                        network: network,
                        address: pair
                    }
                });
                if(!existingPair) {
                    existingPair = await this.createNewPairAndIncludedTokens(network, pair, signer);
                    logger.info(existingPair);
                }
                
                i++;
            } catch (error) {
                fullyLoaded = true;
            }
        }
    }

    async createNewPairAndIncludedTokens(network: number, pair: string, signer: Wallet) {
        let newPair: TokenPair;
        const pairFac: SunSwapPair__factory = new SunSwapPair__factory(signer);
        const pairFactory: SunSwapPair = pairFac.attach(pair);
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
    }

    async createNewPairAndIncludedTokensNoSigner(network: number, pair: string) {
        let signer: Wallet;
        switch (network) {
            case 80001:
                signer = this.polygonSigner;
                break;
            case 97:
                signer = this.bnbSigner;
                break;
            default:
                signer = this.polygonSigner;
                break;
        }
        return await this.createNewPairAndIncludedTokens(network, pair, signer);
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
            let signer: Wallet;
            switch(network) {
                case 80001:
                    signer = this.polygonSigner;
                    break;
                case 97:
                    signer = this.bnbSigner;
                    break;
                default:
                    signer = this.polygonSigner;
                    break;
            }
            const tokenFac: SunSwapERC20__factory = new SunSwapERC20__factory(signer);
            const tokenFactory: SunSwapERC20 = tokenFac.attach(address);
            const newToken = new Token();
            newToken.network = network;
            newToken.address = address;
            newToken.symbol = await tokenFactory.symbol();
            newToken.name = await tokenFactory.name();
            newToken.decimals = await tokenFactory.decimals();
            await this.tokensRepository.save(newToken);
            return newToken;
        }
        return token;
    }
}
