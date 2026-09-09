import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductoModule } from './producto/producto.module';
import { NegocioModule } from './negocio/negocio.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [PrismaModule, ProductoModule, NegocioModule, OnboardingModule],
})
export class AppModule {}
