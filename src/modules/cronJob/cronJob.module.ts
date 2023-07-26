import { Module } from '@nestjs/common';
import { CronJobService } from './cronJob.service';
import { CronJobController } from './cronJob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Token,
    TokenPair,
} from '../../database/entities';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Token,
            TokenPair,
        ]),
        CommonModule
    ],
    providers: [CronJobService],
    controllers: [CronJobController],
})
export class CronJobModule { }
