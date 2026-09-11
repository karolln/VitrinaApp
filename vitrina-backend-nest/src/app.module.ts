import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductoModule } from './producto/producto.module';
import { NegocioModule } from './negocio/negocio.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ProductoModule, NegocioModule, OnboardingModule, AuthModule],
})
export class AppModule {}
