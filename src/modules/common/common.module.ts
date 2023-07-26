import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Token,
    TokenPair,
    PairStatus,
    TokenStatus
} from '../../database/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Token,
            TokenPair,
            PairStatus,
            TokenStatus
        ])
    ],
    providers: [CommonService],
    controllers: [CommonController],
    exports: [CommonService],
})
export class CommonModule { }
