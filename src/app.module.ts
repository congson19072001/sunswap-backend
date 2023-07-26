import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './modules/transaction/transaction.module';
import { CronJobModule } from './modules/cronJob/cronJob.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import {databaseConfig} from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    TransactionModule,
    CronJobModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
