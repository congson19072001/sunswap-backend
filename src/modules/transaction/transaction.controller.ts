import {
    Controller, Get, HttpStatus, Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller()
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService
    ) { }

    @Get('transactions/history')
    @ApiOperation({
        tags: ['transactions'],
        operationId: 'getPriceHistory',
        summary: 'Get history of Price',
        description: 'Get history of Price',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successful'
    })
    @ApiQuery({
        name: 'from-date',
        required: true,
        type: String,
    })
    @ApiQuery({
        name: 'to-date',
        required: true,
        type: String,
    })
    @ApiQuery({
        name: 'from',
        required: true,
        type: String,
    })
    @ApiQuery({
        name: 'to',
        required: true,
        type: String,
    })
    @ApiQuery({
        name: 'network',
        required: true,
        type: Number,
    })
    async getPriceHistory(
        @Query("from-date") fromDate: string,
        @Query("to-date") toDate: string,
        @Query("from") from: string,
        @Query("to") to: string,
        @Query("network") network: number
    ){
        return await this.transactionService.getPriceHistory(fromDate, toDate, from, to, network);
    }
}
