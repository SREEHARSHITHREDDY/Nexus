import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './core/interceptors/response-transform.interceptor';
import { LoggerService } from './core/logging/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);
  const logger = app.get(LoggerService);

  app.useLogger(logger);
  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin:      config.get<string[]>('app.allowedOrigins'),
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist:             true,
    forbidNonWhitelisted:  true,
    transform:             true,
    transformOptions:      { enableImplicitConversion: true },
  }));

  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  app.useGlobalInterceptors(
    app.get(LoggingInterceptor),
    app.get(ResponseTransformInterceptor),
  );

  if (config.get('app.env') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('NEXUS API')
      .setDescription('Next Gen Execution Universal System — API Reference')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.get<number>('app.port', 4000);
  await app.listen(port);

  logger.log(`🚀 NEXUS API running on port ${port}`, 'Bootstrap');
  logger.log(`📚 Swagger docs at http://localhost:${port}/docs`, 'Bootstrap');
}

bootstrap();