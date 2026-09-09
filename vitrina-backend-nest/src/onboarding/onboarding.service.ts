import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerEstado(usuarioId: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return { onboardingCompletado: usuario.onboardingCompletado };
  }

  async completar(usuarioId: number) {
    const usuario = await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { onboardingCompletado: true },
    });
    return { onboardingCompletado: usuario.onboardingCompletado };
  }
}
