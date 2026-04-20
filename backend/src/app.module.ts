import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from '@users/users.module';
import { MailModule } from './mail/mail.module';
import { TokenService } from './token/token.service';
import { AuthModule } from './auth/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { CollectionsModule } from './collections/collections.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';

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
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_CACHE_HOST,
        port: Number(process.env.REDIS_CACHE_PORT),
        password: process.env.REDIS_CACHE_PASSWORD,
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_QUEUE_HOST,
        password: process.env.REDIS_QUEUE_PASSWORD,
        port: Number(process.env.REDIS_QUEUE_PORT),
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
    PrometheusModule.register({
      path: '/metrics',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: {
          target:
            process.env.NODE_ENV === 'production' ? 'pino/file' : 'pino-pretty',
          options:
            process.env.NODE_ENV !== 'production'
              ? { destination: 1 }
              : { singleLine: true },
        },
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              params: req.params,
              query: req.query,
              ...(process.env.NODE_ENV !== 'production' && {
                body: req.body,
              }),
            };
          },
        },
      },
    }),
    UsersModule,
    MailModule,
    AuthModule,
    AuthorsModule,
    CategoriesModule,
    BooksModule,
    CollectionsModule,
    ReviewsModule,
    SearchModule,
    HealthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
