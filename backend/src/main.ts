import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { VersioningType } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as fs from 'fs';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.enableCors();

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'development_external'
  ) {
    const options: SwaggerDocumentOptions = {
      autoTagControllers: true,
    };
    const config = new DocumentBuilder()
      .setTitle('190Bahia')
      .setDescription('Projeto SSP-BA')
      .setVersion('1.0')
      .addGlobalResponse({
        status: 500,
        description: 'Erro Interno do Servidor',
      })
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, options);

    const exportDocument = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./swagger.json', JSON.stringify(exportDocument, null, 2));

    SwaggerModule.setup('docs', app, documentFactory);
  }

  app.use(helmet());

  app.enableVersioning({ type: VersioningType.URI });
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Custom-Header',
  });

  await app.listen(process.env.APP_PORT ?? 6002, '0.0.0.0');
}
bootstrap();
