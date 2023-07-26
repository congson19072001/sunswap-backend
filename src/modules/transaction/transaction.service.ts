import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
    PairStatus,
    TokenPair 
} from '../../database/entities';
import { MongoRepository } from 'typeorm';
import { Wallet, providers } from 'ethers';
import { 
    SunSwapFactory__factory, 
    SunSwapFactory,
} from "../../typechain-types";
import * as bnbContract from "../../shared/bsc_contracts.json";
import * as polygonContract from "../../shared/polygon_contracts.json";
import { CommonService } from '../common/common.service';

@Injectable()
export class TransactionService {
    private bnbSigner: Wallet;
    private polygonSigner: Wallet;
    private bnbFactory: SunSwapFactory;
    private polygonFactory: SunSwapFactory;
    constructor(
        @InjectRepository(TokenPair)
        private pairsRepository: MongoRepository<TokenPair>,
        
        @InjectRepository(PairStatus)
        private pairStatusRepository: MongoRepository<PairStatus>,

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

        const polygonProvider = new providers.JsonRpcProvider(process.env.POLYGON_RPC);
        this.polygonSigner = new Wallet(
            `${process.env.PRIVATE_KEY}`,
            polygonProvider,
        ); 

        const polygonFactoryFac: SunSwapFactory__factory = new SunSwapFactory__factory(this.polygonSigner);
        this.polygonFactory = polygonFactoryFac.attach(polygonContract.SUNSWAP_FACTORY);
    }

    async getPriceHistory(
        fromDate: string,
        toDate: string,
        from: string,
        to: string,
        network: number
    ): Promise<PairStatus[]> {
        const isReverse = from > to;
        const fromSecond = Math.floor((new Date(from)).getTime() / 1000);
        const toSecond = Math.floor((new Date(to)).getTime() / 1000);
        let existingPair = await this.pairsRepository.findOne({
            where: {
                token0: isReverse ? to : from,
                token1: isReverse ? from : to,
                network,
            }
        });
        if(!existingPair){
            switch(network){
                case 80001: {
                    const pair = await this.polygonFactory.getPair(from, to);
                    if(!pair) return [];
                    existingPair = await this.commonService.createNewPairAndIncludedTokensNoSigner(80001, pair);
                    break;
                }
                case 97: {
                    const pair = await this.bnbFactory.getPair(from, to);
                    if(!pair) return [];
                    existingPair = await this.commonService.createNewPairAndIncludedTokensNoSigner(97, pair);
                    break;
                }
                default: {
                    const pair = await this.polygonFactory.getPair(from, to);
                    if(!pair) return [];
                    existingPair = await this.commonService.createNewPairAndIncludedTokensNoSigner(80001, pair);
                    break;
                }
            }
        }

        const pairStatuses = await this.pairStatusRepository.find({
            where: {
                network,
                address: existingPair.address,
                timestamp: {
                    $gte: fromSecond,
                    $lte: toSecond,
                }
            }
        });
        return pairStatuses;

    }
}
