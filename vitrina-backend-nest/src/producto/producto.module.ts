import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { GeminiVisionModule } from '../integraciones/gemini-vision/gemini-vision.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [GeminiVisionModule, AuthModule],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}