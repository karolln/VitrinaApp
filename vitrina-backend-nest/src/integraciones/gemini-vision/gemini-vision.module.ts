import { Module } from '@nestjs/common';
import { GeminiVisionService } from './gemini-vision.service';

@Module({
  providers: [GeminiVisionService],
  exports: [GeminiVisionService],
})
export class GeminiVisionModule {}