import { Module } from '@nestjs/common';
import { CronJobService } from './cronJob.service';
import { CronJobController } from './cronJob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Token,
    TokenPair,
    PairStatus
} from '../../database/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Token,
            TokenPair,
            PairStatus
        ])
    ],
    providers: [CronJobService],
    controllers: [CronJobController],
})
export class CronJobModule { }
