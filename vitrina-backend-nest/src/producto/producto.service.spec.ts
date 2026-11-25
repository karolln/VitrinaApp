import { Test } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { PrismaService } from '../prisma/prisma.service';

const DUENO = 5;
const OTRO_USUARIO = 8;

describe('ProductoService', () => {
  let service: ProductoService;
  let prisma: {
    negocio: { findUnique: jest.Mock };
    producto: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      negocio: { findUnique: jest.fn() },
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

  describe('HU-05: crear producto', () => {
    it('crea el producto con estado disponible si el negocio es del usuario', async () => {
      prisma.negocio.findUnique.mockResolvedValue({ id: 1, usuarioId: DUENO });
      prisma.producto.create.mockResolvedValue({ id: 10, estado: 'disponible' });

      const resultado = await service.crear(
        { fotoUrl: 'http://img/arroz.jpg', negocioId: 1 } as any,
        DUENO,
      );

      expect(resultado.estado).toBe('disponible');
      expect(prisma.producto.create).toHaveBeenCalled();
    });

    it('lanza NotFoundException si el negocio no existe', async () => {
      prisma.negocio.findUnique.mockResolvedValue(null);

      await expect(
        service.crear({ fotoUrl: 'http://img/x.jpg', negocioId: 999 } as any, DUENO),
      ).rejects.toThrow(NotFoundException);
    });

    it('Autorización: lanza ForbiddenException si el negocio es de otro usuario', async () => {
      prisma.negocio.findUnique.mockResolvedValue({ id: 1, usuarioId: DUENO });

      await expect(
        service.crear({ fotoUrl: 'http://img/x.jpg', negocioId: 1 } as any, OTRO_USUARIO),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.producto.create).not.toHaveBeenCalled();
    });
  });

  describe('HU-09: listar productos', () => {
    it('devuelve los productos de un negocio', async () => {
      prisma.producto.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const resultado = await service.listarPorNegocio(1);

      expect(resultado).toHaveLength(2);
    });
  });

  describe('HU-08: cambiar estado', () => {
    it('alterna de disponible a agotado', async () => {
      prisma.producto.findUnique.mockResolvedValue({
        id: 1,
        estado: 'disponible',
        negocio: { usuarioId: DUENO },
      });
      prisma.producto.update.mockResolvedValue({ id: 1, estado: 'agotado' });

      const resultado = await service.cambiarEstado(1, DUENO);

      expect(resultado.estado).toBe('agotado');
    });

    it('lanza NotFoundException si el producto no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null);

      await expect(service.cambiarEstado(999, DUENO)).rejects.toThrow(NotFoundException);
    });

    it('Autorización: lanza ForbiddenException si el producto es de otro negocio', async () => {
      prisma.producto.findUnique.mockResolvedValue({
        id: 1,
        estado: 'disponible',
        negocio: { usuarioId: DUENO },
      });

      await expect(service.cambiarEstado(1, OTRO_USUARIO)).rejects.toThrow(ForbiddenException);
      expect(prisma.producto.update).not.toHaveBeenCalled();
    });
  });

  describe('HU-06: editar producto', () => {
    it('actualiza el producto con los campos enviados', async () => {
      prisma.producto.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Arroz',
        negocio: { usuarioId: DUENO },
      });
      prisma.producto.update.mockResolvedValue({ id: 1, nombre: 'Arroz Diana 1kg' });

      const resultado = await service.actualizar(1, { nombre: 'Arroz Diana 1kg' }, DUENO);

      expect(resultado.nombre).toBe('Arroz Diana 1kg');
      expect(prisma.producto.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('lanza NotFoundException si el producto no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null);

      await expect(service.actualizar(999, { nombre: 'X' }, DUENO)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.producto.update).not.toHaveBeenCalled();
    });

    it('lanza BadRequestException si no se envía ningún campo', async () => {
      prisma.producto.findUnique.mockResolvedValue({ id: 1, negocio: { usuarioId: DUENO } });

      await expect(service.actualizar(1, {}, DUENO)).rejects.toThrow(BadRequestException);
      expect(prisma.producto.update).not.toHaveBeenCalled();
    });

    it('Autorización: lanza ForbiddenException si el producto es de otro negocio', async () => {
      prisma.producto.findUnique.mockResolvedValue({ id: 1, negocio: { usuarioId: DUENO } });

      await expect(service.actualizar(1, { nombre: 'X' }, OTRO_USUARIO)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prisma.producto.update).not.toHaveBeenCalled();
    });
  });

  describe('Precio del producto', () => {
    it('guarda el precio al crear', async () => {
      prisma.negocio.findUnique.mockResolvedValue({ id: 1, usuarioId: DUENO });
      prisma.producto.create.mockResolvedValue({ id: 10, precio: 2500 });

      await service.crear(
        { fotoUrl: 'http://img/arroz.jpg', negocioId: 1, precio: 2500 } as any,
        DUENO,
      );

      expect(prisma.producto.create.mock.calls[0][0].data.precio).toBe(2500);
    });

    it('permite editar solo el precio', async () => {
      prisma.producto.findUnique.mockResolvedValue({ id: 1, negocio: { usuarioId: DUENO } });
      prisma.producto.update.mockResolvedValue({ id: 1, precio: 3000 });

      const resultado = await service.actualizar(1, { precio: 3000 }, DUENO);

      expect(resultado.precio).toBe(3000);
      expect(prisma.producto.update.mock.calls[0][0].data.precio).toBe(3000);
    });
  });
});