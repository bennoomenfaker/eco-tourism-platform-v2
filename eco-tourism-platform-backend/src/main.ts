import 'reflect-metadata';
import { execSync } from 'child_process';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

function freePort(port: number) {
  try {
    execSync(`lsof -ti :${port} | xargs kill -9`, { stdio: 'ignore' });
    // Laisser le temps au OS de libérer le port
    execSync('sleep 0.5', { stdio: 'ignore' });
  } catch { /* port déjà libre */ }
}

async function bootstrap() {
  // Pas de `cors: true` ici : la politique est définie plus bas par
  // enableCors (liste d'origines autorisées + credentials).
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  // Les listes publiques (catalogue complet) pèsent ~95 Ko ; sur un lien
  // distant, la réponse non compressée met plusieurs secondes. gzip la
  // ramène à ~15 Ko.
  app.use(require('compression')({ threshold: 1024 }));

  app.use(require('express').json({ limit: '5mb' }));
  app.use(require('express').urlencoded({ limit: '5mb', extended: true }));

  // FRONTEND_URL + CORS_ORIGINS (liste séparée par des virgules) : plusieurs
  // adresses peuvent servir le front (IP, domaine duckdns, localhost).
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    ...(process.env.CORS_ORIGINS ?? '').split(','),
    process.env.FRONTEND_URL,
  ]
    .map((origin) => origin?.trim().replace(/\/$/, ''))
    .filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector),
  );

  const config = new DocumentBuilder()
    .setTitle('Eco Tourism Platform ')
    .setDescription(' Platform du eco tourism')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT || 4000);

  freePort(port);
  await app.listen(port);

  console.log(`✅ API: http://localhost:${port}/api`);
  console.log(`📘 Swagger: http://localhost:${port}/swagger`);
}

bootstrap();