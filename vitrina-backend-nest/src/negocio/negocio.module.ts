import { Module } from '@nestjs/common';
import { NegocioController } from './negocio.controller';
import { NegocioService } from './negocio.service';

@Module({
  controllers: [NegocioController],
  providers: [NegocioService],
})
export class NegocioModule {}
