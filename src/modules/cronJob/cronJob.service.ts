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
import { CommonService } from '../common/common.service';
const logger = getLogger('CronJobService');

@Injectable()
export class CronJobService {
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

        private readonly commonService: CommonService
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
    
    /**
     * Retrieves and saves all pairs from the Polygon and Binance Smart Chain factories.
     *
     * @return {Promise<void>} Promise that resolves when all pairs are retrieved and saved.
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async getallPairs() {
        logger.info("getallPairs");
        const networks = [80001, 97];
        for(const network of networks){
            await this.commonService.updatePairAndTokenList(network);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async getPairStatuses() {
        logger.info("getPairStatuses");
        const polygonTokenPairs = await this.pairsRepository.find({
            where: {
                network: 80001
            }
        });

        for(let pair of polygonTokenPairs) {
            const pairFac: SunSwapPair__factory = new SunSwapPair__factory(this.polygonSigner);
            const pairFactory: SunSwapPair = pairFac.attach(pair.address);
            const reserves = await pairFactory.getReserves();
            await this.commonService.savePairStatus(80001, pair.address, pair.token0, pair.token1, reserves._reserve0, reserves._reserve1, pair.decimals0, pair.decimals1, Math.floor(Date.now() / 1000));

        }

        const bnbTokenPairs = await this.pairsRepository.find({
            where: {
                network: 97
            }
        });

        for(let pair of bnbTokenPairs) {
            const pairFac: SunSwapPair__factory = new SunSwapPair__factory(this.bnbSigner);
            const pairFactory: SunSwapPair = pairFac.attach(pair.address);
            const reserves = await pairFactory.getReserves();
            await this.commonService.savePairStatus(97, pair.address, pair.token0, pair.token1, reserves._reserve0, reserves._reserve1, pair.decimals0, pair.decimals1, Math.floor(Date.now() / 1000));
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async getTokenStatuses() {
        logger.info("getTokenStatuses");
        const polygonTokens = await this.tokensRepository.find(
            {
                where: {
                    network: 80001
                }
            }
        );

        for(let token of polygonTokens){
            const tokenFac: SunSwapERC20__factory = new SunSwapERC20__factory(this.polygonSigner);
            const tokenFactory: SunSwapERC20 = tokenFac.attach(token.address);
            const reserves = await tokenFactory.totalSupply();
            await this.commonService.saveTokenStatus(80001, token.address, reserves, Math.floor(Date.now() / 1000));
        }

        const bnbTokens = await this.tokensRepository.find(
            {
                where: {
                    network: 97
                }
            }
        );

        for(let token of bnbTokens){
            const tokenFac: SunSwapERC20__factory = new SunSwapERC20__factory(this.bnbSigner);
            const tokenFactory: SunSwapERC20 = tokenFac.attach(token.address);
            const reserves = await tokenFactory.totalSupply();
            await this.commonService.saveTokenStatus(97, token.address, reserves, Math.floor(Date.now() / 1000));
        }

    }
}
