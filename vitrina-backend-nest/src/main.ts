import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; //configura swagger
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

////construir la app
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  //se agregan las validaciones global dto
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  //se prepara la documentación
  const config = new DocumentBuilder()
    .setTitle('VitrinaApp API')
    .setDescription(
      'API del backend de VitrinaApp: catálogo de productos y visibilidad de negocios informales de barrio.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config); //crea la documentación
  SwaggerModule.setup('docs', app, document); // documentación disponible en /docs
//se enciende el puerto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`VitrinaApp backend (NestJS) corriendo en http://localhost:${port}`);
  console.log(`Documentación Swagger en http://localhost:${port}/docs`);
}
bootstrap();
