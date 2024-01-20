import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http/http-exception.filter';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new HttpExceptionFilter(
      new LoggerService(new ConfigService(), HttpExceptionFilter.name),
    ),
  );
  await app.listen(3000);
}
bootstrap();
