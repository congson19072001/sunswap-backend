import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from "@nestjs/schedule";
import { ethers, providers, Wallet } from "ethers";
import { 
    SunSwapFactory__factory, 
    SunSwapFactory, 
    SunSwapPair,
    SunSwapPair__factory
} from "../../typechain-types";
import * as bnbContract from "../../shared/bsc_contracts.json";
import * as polygonContract from "../../shared/polygon_contracts.json";
import { getLogger } from '../../shared/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPair } from '../../database/entities';
import { MongoRepository } from 'typeorm';
const logger = getLogger('CronJobService');

@Injectable()
export class CronJobService {
    private bnbSigner: Wallet;
    private polygonSigner: Wallet;
    private bnbFactory: SunSwapFactory;
    private polygonFactory: SunSwapFactory;
    constructor(
        @InjectRepository(TokenPair)
        private pairsRepository: MongoRepository<TokenPair>,
    ) { 
        // Initialize providers
        const bnbProvider = new providers.JsonRpcProvider(process.env.BSC_RPC);
        this.bnbSigner = new ethers.Wallet(
            `${process.env.PRIVATE_KEY}`,
            bnbProvider,
        );
        const bnbFactoryFac: SunSwapFactory__factory = new SunSwapFactory__factory(this.bnbSigner);
        this.bnbFactory = bnbFactoryFac.attach(bnbContract.SUNSWAP_FACTORY);

        const polygonProvider = new providers.JsonRpcProvider(process.env.POLYGON_RPC);
        this.polygonSigner = new ethers.Wallet(
            `${process.env.PRIVATE_KEY}`,
            polygonProvider,
        );    
        const polygonFactoryFac: SunSwapFactory__factory = new SunSwapFactory__factory(this.polygonSigner);
        this.polygonFactory = polygonFactoryFac.attach(polygonContract.SUNSWAP_FACTORY);
    }
    
    /**
     * Retrieves and saves all pairs from the Polygon and Binance Smart Chain factories.
     *
     * @return {Promise<void>} Promise that resolves when all pairs are retrieved and saved.
     */
    @Cron(CronExpression.EVERY_30_MINUTES)
    async getallPairs() {
        logger.info("getallPairs");
        let fullyLoaded = false;
        let i = 0;
        while (!fullyLoaded) {
            try {
                const pair = await this.polygonFactory.allPairs(i);
                let existingPair = await this.pairsRepository.findOne({
                    where: {
                        network: 80001,
                        address: pair
                    }
                });
                if(!existingPair) {
                    const pairFac: SunSwapPair__factory = new SunSwapPair__factory(this.polygonSigner);
                    const pairFactory: SunSwapPair = pairFac.attach(pair);
                    existingPair = new TokenPair();
                    existingPair.network = 80001;
                    existingPair.address = pair;
                    existingPair.token0 = await pairFactory.token0();
                    existingPair.token1 = await pairFactory.token1();
                    await this.pairsRepository.save(existingPair);
                    logger.info(existingPair);
                }
                
                i++;
            } catch (error) {
                fullyLoaded = true;
            }
        }
        fullyLoaded = false;
        i = 0;
        while (!fullyLoaded) {
            try {
                const pair = await this.bnbFactory.allPairs(i);
                let existingPair = await this.pairsRepository.findOne({
                    where: {
                        network: 97,
                        address: pair
                    }
                });
                if(!existingPair) {
                    const pairFac: SunSwapPair__factory = new SunSwapPair__factory(this.bnbSigner);
                    const pairFactory: SunSwapPair = pairFac.attach(pair);
                    existingPair = new TokenPair();
                    existingPair.network = 97;
                    existingPair.address = pair;
                    existingPair.token0 = await pairFactory.token0();
                    existingPair.token1 = await pairFactory.token1();
                    await this.pairsRepository.save(existingPair);
                    logger.info(existingPair);
                }
                
                i++;
            } catch (error) {
                fullyLoaded = true;
            }
        }
    }
}
