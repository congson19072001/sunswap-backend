import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairStatus, Token, TokenPair, TokenStatus } from '../../database/entities';
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
    providers: [TransactionService],
    controllers: [TransactionController],
})
export class TransactionModule { }
