import { Module } from '@nestjs/common';
import { CronJobService } from './cronJob.service';
import { CronJobController } from './cronJob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Token,
    TokenPair,
    PairStatus,
    TokenStatus
} from '../../database/entities';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Token,
            TokenPair,
            PairStatus,
            TokenStatus
        ]),
        CommonModule
    ],
    providers: [CronJobService],
    controllers: [CronJobController],
})
export class CronJobModule { }
