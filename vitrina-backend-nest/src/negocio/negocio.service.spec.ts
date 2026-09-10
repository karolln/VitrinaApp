import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NegocioService } from './negocio.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NegocioService', () => {
  let service: NegocioService;
  let prisma: { negocio: { findUnique: jest.Mock; findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = { negocio: { findUnique: jest.fn(), findMany: jest.fn() } };

    const moduleRef = await Test.createTestingModule({
      providers: [NegocioService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(NegocioService);
  });

  describe('HU-04: perfil público', () => {
    it('marca catalogoEnConstruccion=false cuando hay productos', async () => {
      prisma.negocio.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Tienda Doña Lucía',
        barrio: 'La Esmeralda',
        descripcion: null,
        productos: [{ id: 1 }],
      });

      const resultado = await service.perfilPublico(1);

      expect(resultado.catalogoEnConstruccion).toBe(false);
    });

    it('marca catalogoEnConstruccion=true cuando no hay productos', async () => {
      prisma.negocio.findUnique.mockResolvedValue({
        id: 2,
        nombre: 'Papelería Bello Horizonte',
        barrio: 'Bello Horizonte',
        descripcion: null,
        productos: [],
      });

      const resultado = await service.perfilPublico(2);

      expect(resultado.catalogoEnConstruccion).toBe(true);
    });

    it('lanza NotFoundException si el negocio no existe', async () => {
      prisma.negocio.findUnique.mockResolvedValue(null);

      await expect(service.perfilPublico(999)).rejects.toThrow(NotFoundException);
    });
  });
  describe('HU-05: buscar negocios', () => {
    it('filtra por barrio', async () => {
      prisma.negocio.findMany.mockResolvedValue([{ id: 1, barrio: 'La Esmeralda' }]);

      const resultado = await service.buscar(undefined, 'La Esmeralda');

      expect(resultado).toHaveLength(1);
    });

    it('devuelve lista vacía si no hay coincidencias', async () => {
      prisma.negocio.findMany.mockResolvedValue([]);

      const resultado = await service.buscar('NoExiste');

      expect(resultado).toHaveLength(0);
    });

    it('ignora espacios en blanco en los filtros (trim)', async () => {
      prisma.negocio.findMany.mockResolvedValue([{ id: 1, barrio: 'La Esmeralda' }]);

      await service.buscar('  ', '   ');

      expect(prisma.negocio.findMany).toHaveBeenCalledWith({
        where: { AND: [{}, {}] },
        orderBy: { nombre: 'asc' },
      });
    });
  });
});
