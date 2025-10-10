/* eslint-disable @typescript-eslint/no-floating-promises */
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
import * as csurf from 'csurf';
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
      .setTitle('Simula AI')
      .setDescription('Dev: Elton Marques')
      .setVersion('1.0')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('docs', app, documentFactory);
  }
  app.use(cookieParser());
  const csrfProtection = csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  });
  app.use((req, res, next) => {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return next(); // ignora CSRF
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return csrfProtection(req, res, next);
  });
  app.enableCors({
    origin: [process.env.WEB_URL],
    credentials: true,
  });
  app.use(helmet());
  await app.listen(process.env.APP_PORT ?? 6002);
}
bootstrap();
