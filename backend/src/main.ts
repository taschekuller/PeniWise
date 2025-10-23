import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { appConfig, swaggerConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfigValues = appConfig();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: appConfigValues.corsOrigin,
    credentials: appConfigValues.corsCredentials,
  });

  // API prefix
  app.setGlobalPrefix(`${appConfigValues.apiPrefix}/${appConfigValues.apiVersion}`);

  // Swagger documentation
  const swaggerConfigValues = swaggerConfig();
  if (swaggerConfigValues.enabled) {
    const config = new DocumentBuilder()
      .setTitle('PeniWise API')
      .setDescription('The PeniWise API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfigValues.path, app, document);
  }

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/${swaggerConfigValues.path}`);
}

bootstrap();
