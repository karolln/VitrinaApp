import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductoService', () => {
  let service: ProductoService;
  let prisma: {
    negocio: { findUnique: jest.Mock };
    categoria: { findUnique: jest.Mock };
    producto: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      negocio: { findUnique: jest.fn() },
      categoria: { findUnique: jest.fn() },
      producto: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ProductoService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(ProductoService);
  });

  describe('HU-01: crear producto', () => {
    it('crea el producto con estado disponible si el negocio y la categoria existen', async () => {
      prisma.negocio.findUnique.mockResolvedValue({ id: 1 });
      prisma.categoria.findUnique.mockResolvedValue({ id: 1 });
      prisma.producto.create.mockResolvedValue({ id: 10, estado: 'disponible' });

      const resultado = await service.crear(
        { negocioId: 1, categoriaId: 1 } as any,
        'http://img/arroz.jpg',
      );

      expect(resultado.estado).toBe('disponible');
      expect(prisma.producto.create).toHaveBeenCalled();
    });

    it('lanza NotFoundException si el negocio no existe', async () => {
      prisma.negocio.findUnique.mockResolvedValue(null);

      await expect(
        service.crear({ negocioId: 999, categoriaId: 1 } as any, 'http://img/x.jpg'),
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFoundException si la categoria no existe', async () => {
      prisma.negocio.findUnique.mockResolvedValue({ id: 1 });
      prisma.categoria.findUnique.mockResolvedValue(null);

      await expect(
        service.crear({ negocioId: 1, categoriaId: 999 } as any, 'http://img/x.jpg'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('HU-02: listar productos', () => {
    it('devuelve los productos de un negocio', async () => {
      prisma.producto.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const resultado = await service.listarPorNegocio(1);

      expect(resultado).toHaveLength(2);
    });
  });

  describe('HU-03: cambiar estado', () => {
    it('alterna de disponible a agotado', async () => {
      prisma.producto.findUnique.mockResolvedValue({ id: 1, estado: 'disponible' });
      prisma.producto.update.mockResolvedValue({ id: 1, estado: 'agotado' });

      const resultado = await service.cambiarEstado(1);

      expect(resultado.estado).toBe('agotado');
    });

    it('lanza NotFoundException si el producto no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null);

      await expect(service.cambiarEstado(999)).rejects.toThrow(NotFoundException);
    });
  });
});