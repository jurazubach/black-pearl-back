import fs from 'fs';
import path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204,
    },
    httpsOptions: {
      key: fs.readFileSync(path.resolve('./cert/api.black-pearl.local-key.pem')),
      cert: fs.readFileSync(path.resolve('./cert/api.black-pearl.local.pem')),
    },
  });

  app.setGlobalPrefix(process.env.API_ROUTE_PREFIX as string);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
      disableErrorMessages: process.env.ENV !== 'dev',
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('The Black Pearl')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(process.env.API_SWAGGER_URL as string, app, document);

  await app.listen(process.env.API_PORT as string);

  console.log(`API server successfully started on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => console.error(err.message));
