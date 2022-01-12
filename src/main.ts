import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser('secret'));
  app.enableCors({
    origin: true,
    credentials: true
  });
  await app.listen(4000);
}
bootstrap();
