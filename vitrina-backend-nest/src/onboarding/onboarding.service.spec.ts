import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OnboardingService', () => {
  let service: OnboardingService;
  let prisma: { usuario: { findUnique: jest.Mock; update: jest.Mock } };

  beforeEach(async () => {
    prisma = { usuario: { findUnique: jest.fn(), update: jest.fn() } };

    const moduleRef = await Test.createTestingModule({
      providers: [OnboardingService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(OnboardingService);
  });

  it('un usuario nuevo tiene onboardingCompletado en false', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ id: 1, onboardingCompletado: false });

    const resultado = await service.obtenerEstado(1);

    expect(resultado.onboardingCompletado).toBe(false);
  });

  it('permite completar (o saltar) el onboarding', async () => {
    prisma.usuario.update.mockResolvedValue({ id: 1, onboardingCompletado: true });

    const resultado = await service.completar(1);

    expect(resultado.onboardingCompletado).toBe(true);
  });

  it('lanza NotFoundException si el usuario no existe', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(service.obtenerEstado(999)).rejects.toThrow(NotFoundException);
  });
});
