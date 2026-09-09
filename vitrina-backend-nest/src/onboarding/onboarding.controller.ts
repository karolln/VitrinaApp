import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';

@ApiTags('Primeros pasos (HU-06)')
@Controller('api/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get(':usuarioId')
  @ApiOperation({ summary: 'HU-06: Consultar estado del recorrido guiado' })
  obtenerEstado(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.onboardingService.obtenerEstado(usuarioId);
  }

  @Post(':usuarioId/completar')
  @ApiOperation({ summary: 'HU-06: Marcar el recorrido guiado como completado o saltado' })
  completar(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.onboardingService.completar(usuarioId);
  }
}
