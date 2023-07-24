require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { debugLog, logger } from './shared/logger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
const express = require('express')

async function bootstrap() {
  let app = null;
  if (process.env.NODE_ENV !== 'dev-api' && process.env.NODE_ENV !== 'prod-api' && process.env.NODE_ENV !== 'test-api') {
    debugLog(`NODE_ENV set to dev-api`);
  }
  const server = express();
  app = await NestFactory.create(AppModule,
    new ExpressAdapter(server));

  const options = new DocumentBuilder()
    .setTitle('SunSwap APIs')
    .setDescription('SunSwap APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Bearer *token*',
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'JWT',
    )
    .addSecurityRequirements('JWT')
    .build();

  if (process.env.NODE_ENV !== 'prod-api') {
    const document = SwaggerModule.createDocument(app, options);
    writeSwaggerJson(`${process.cwd()}`, document);
    SwaggerModule.setup('docs', app, document);
  }

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(logger);
  app.enableCors(
    {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    }
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  http.createServer(server).listen(process.env.PORT || 3000);
  debugLog(`Application is running on: ${process.env.PORT || 3000}`);
  
}
bootstrap();

export const writeSwaggerJson = (path: string, document) => {
  fs.writeFileSync(`${path}/swagger.json`, JSON.stringify(document, null, 2), { encoding: 'utf8' });
};
