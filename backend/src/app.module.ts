import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmConfig } from '@/utils/database/typeorm.config';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from '@users/users.module';
import { MailModule } from './mail/mail.module';
import { TokenService } from './token/token.service';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';
import { OrganizationsModule } from './organizations/organizations.module';
import KeyvRedis from '@keyv/redis';
import { AdminsModule } from './admins/admins.module';
import { CitiesModule } from './cities/cities.module';
import { StatesModule } from './states/states.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
          blockDuration: 5000,
        },
      ],
    }),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [
            new KeyvRedis(
              `redis://:${process.env.REDIS_CACHE_PASSWORD}@${process.env.REDIS_CACHE_HOST}:${process.env.REDIS_CACHE_PORT}`,
            ),
          ],
          ttl: 5000,
        };
      },
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_QUEUE_HOST,
        port: Number(process.env.REDIS_QUEUE_PORT),
        password: process.env.REDIS_QUEUE_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 1000,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'production'
          ? {}
          : {
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                },
              },
            },
    }),
    LoggerModule.forRoot(),
    UsersModule,
    MailModule,
    AuthModule,
    ExamsModule,
    OrganizationsModule,
    AdminsModule,
    CitiesModule,
    StatesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokenService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
