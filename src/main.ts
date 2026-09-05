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
import multipart from '@fastify/multipart';
import { createValidationPipe } from './shared/infrastructure/http/pipes/validation.pipe';
import { MAX_ATTACHMENT_BYTES } from './modules/cards/domain/attachment-policy';
import { DomainExceptionFilter } from './shared/infrastructure/http/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // El corte por tamaño va acá además de en el caso de uso: así un archivo
  // enorme se aborta mientras entra, sin llegar a materializarse en memoria.
  await app.register(multipart, {
    limits: { fileSize: MAX_ATTACHMENT_BYTES, files: 1 },
  });

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE'],
  });

  const config = new DocumentBuilder()
    .setTitle('Trellium API')
    .setDescription('API documentation for Trellium')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('me')
    .addTag('boards')
    .addTag('lists')
    .addTag('attachments')
    .addTag('search')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
