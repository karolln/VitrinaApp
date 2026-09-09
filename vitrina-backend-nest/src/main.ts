import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('VitrinaApp API')
    .setDescription(
      'API del backend de VitrinaApp: catálogo de productos y visibilidad de negocios informales de barrio.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // documentación disponible en /docs

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`VitrinaApp backend (NestJS) corriendo en http://localhost:${port}`);
  console.log(`Documentación Swagger en http://localhost:${port}/docs`);
}
bootstrap();
