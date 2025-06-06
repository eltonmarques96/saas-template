/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmConfig } from '@config/typeorm.config';
import { UsersModule } from '@users/users.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 40000,
          limit: 10,
        },
      ],
    }),
    RedisModule.forRoot({
      config: {
        host: '0.0.0.0',
        port: 6379,
        password: 'password',
      },
    }),
    BullModule.forRoot({
      connection: {
        host: '0.0.0.0',
        port: 6379,
      },
    }),
    LoggerModule.forRoot(),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
