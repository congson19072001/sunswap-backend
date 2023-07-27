import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
    PairStatus,
    TokenPair 
} from '../../database/entities';
import { MongoRepository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { PriceHistoryResponse } from './response/price_history';
import { BigNumber as BigNumberJs } from 'bignumber.js';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TokenPair)
        private pairsRepository: MongoRepository<TokenPair>,
        
        @InjectRepository(PairStatus)
        private pairStatusRepository: MongoRepository<PairStatus>,

        private readonly commonService: CommonService
    ) { 
        // Initialize providers
    }

    async getPriceHistory(
        fromDate: string,
        toDate: string,
        from: string,
        to: string,
        network: number
    ): Promise<PriceHistoryResponse> {
        network = Number(network);
        const isReverse = from > to;
        const fromSecond = Math.floor((new Date(fromDate)).getTime());
        const toSecond = Math.floor((new Date(toDate)).getTime());
        let existingPair = await this.pairsRepository.findOne({
            where: {
                token0: isReverse ? to : from,
                token1: isReverse ? from : to,
                network,
            }
        });
        if(!existingPair){
            const pair = await this.commonService.getPair(network, from, to);
            if(!pair) return {
                totalItems: 0,
                prices: []
            };
            existingPair = await this.commonService.createNewPairAndIncludedTokens(network, pair);
            if(!existingPair) return {
                totalItems: 0,
                prices: []
            };
        }
        const pairStatuses = await this.pairStatusRepository.find({
            where: {
                network,
                address: existingPair.address,
                timestamp: {
                    $gte: Number(fromSecond), 
                    $lte: Number(toSecond)
                }
            },
            order: {
                timestamp: 'ASC'
            }
        });
        const result = isReverse ? {
            totalItems: pairStatuses.length,
            prices: pairStatuses.map(pairStatus => {
                return {
                    price: (new BigNumberJs(1)).div(pairStatus.ratio).toString(),
                    time: Number(pairStatus.timestamp)
                }
            })
        } : {
            totalItems: pairStatuses.length,
            prices: pairStatuses.map(pairStatus => {
                return {
                    price: (new BigNumberJs(pairStatus.ratio)).toString(),
                    time: Number(pairStatus.timestamp)
                }
            })
        };
        return result;

    }
}
