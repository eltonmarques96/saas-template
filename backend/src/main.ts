import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.NODE_ENV === 'development') {
    const options: SwaggerDocumentOptions = {
      autoTagControllers: true,
    };
    const config = new DocumentBuilder()
      .setTitle('SaaS Template')
      .setDescription('Dev: Elton Marques')
      .setVersion('1.0')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('docs', app, documentFactory);
  }
  app.use(cookieParser());

  app.use(helmet());
  await app.listen(process.env.APP_PORT ?? 8000);
}
bootstrap();
