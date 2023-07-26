import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from "@nestjs/schedule";
import { getLogger } from '../../shared/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Token, TokenPair } from '../../database/entities';
import { MongoRepository } from 'typeorm';
import { CommonService } from '../common/common.service';
const logger = getLogger('CronJobService');

@Injectable()
export class CronJobService {
    private networks: number[];
    constructor(
        @InjectRepository(TokenPair)
        private pairsRepository: MongoRepository<TokenPair>,

        @InjectRepository(Token)
        private tokensRepository: MongoRepository<Token>,

        private readonly commonService: CommonService
    ) {
        this.networks = [80001, 97];
    }
    
    /**
     * Retrieves and saves all pairs from the Polygon and Binance Smart Chain factories.
     *
     * @return {Promise<void>} Promise that resolves when all pairs are retrieved and saved.
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async getallPairs() {
        logger.info("getallPairs");
        for(const network of this.networks){
            await this.commonService.updatePairAndTokenList(network);
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async getPairStatuses() {
        logger.info("getPairStatuses");
        for(const network of this.networks){
            const tokenPairs = await this.pairsRepository.find({
                where: {
                    network
                }
            });
            for(let pair of tokenPairs) {
                await this.commonService.getPairStatuses(pair);
            }
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async getTokenStatuses() {
        logger.info("getTokenStatuses");
        for(const network of this.networks){
            const tokens = await this.tokensRepository.find(
                {
                    where: {
                        network: network
                    }
                }
            );
            for(let token of tokens){
                this.commonService.getTokenStatuses(token);
            }
        }
    }
}
