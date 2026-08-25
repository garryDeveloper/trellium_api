import { existsSync } from 'fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createValidationPipe } from './shared/infrastructure/http/pipes/validation.pipe';
import { DomainExceptionFilter } from './shared/infrastructure/http/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Trellium API')
    .setDescription('API documentation for Trellium')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('me')
    .addTag('boards')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
