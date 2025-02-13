import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const port = parseInt(process.env.PORT) || 5001;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('/api/v1');
  app.enableShutdownHooks();
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.use(express.json({ limit: '100mb' }));
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
