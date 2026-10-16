import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiVisionService } from '../integraciones/gemini-vision/gemini-vision.service';

describe('Integración: PATCH /api/productos/:id (HU-06)', () => {
    let app: INestApplication;

    const prisma = {
        negocio: { findUnique: jest.fn() },
        producto: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProductoController],
            providers: [
                ProductoService,
                { provide: PrismaService, useValue: prisma },
                { provide: GeminiVisionService, useValue: {} },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('200: edita el producto y devuelve los datos actualizados', async () => {
        prisma.producto.findUnique.mockResolvedValue({ id: 1, nombre: 'Viejo', cantidad: 1 });
        prisma.producto.update.mockResolvedValue({ id: 1, nombre: 'Nuevo', cantidad: 5 });

        const res = await request(app.getHttpServer())
            .patch('/api/productos/1')
            .send({ nombre: 'Nuevo', cantidad: 5 })
            .expect(200);

        expect(res.body).toEqual({ id: 1, nombre: 'Nuevo', cantidad: 5 });
        expect(prisma.producto.update).toHaveBeenCalledTimes(1);
    });

    it('404: el producto no existe', async () => {
        prisma.producto.findUnique.mockResolvedValue(null);

        await request(app.getHttpServer())
            .patch('/api/productos/999')
            .send({ nombre: 'X' })
            .expect(404);

        expect(prisma.producto.update).not.toHaveBeenCalled();
    });

    it('400: body vacío', async () => {
        prisma.producto.findUnique.mockResolvedValue({ id: 1 });

        await request(app.getHttpServer())
            .patch('/api/productos/1')
            .send({})
            .expect(400);

        expect(prisma.producto.update).not.toHaveBeenCalled();
    });

    it('400: cantidad negativa (falla la validación del DTO)', async () => {
        await request(app.getHttpServer())
            .patch('/api/productos/1')
            .send({ cantidad: -3 })
            .expect(400);

        expect(prisma.producto.update).not.toHaveBeenCalled();
    });

    it('400: el id no es un número', async () => {
        await request(app.getHttpServer())
            .patch('/api/productos/abc')
            .send({ nombre: 'X' })
            .expect(400);
    });

    it('ignora campos que no están en el DTO', async () => {
        prisma.producto.findUnique.mockResolvedValue({ id: 1 });
        prisma.producto.update.mockResolvedValue({ id: 1, nombre: 'Nuevo' });

        await request(app.getHttpServer())
            .patch('/api/productos/1')
            .send({ nombre: 'Nuevo', hack: 'malo' })
            .expect(200);

        const data = prisma.producto.update.mock.calls[0][0].data;
        expect(data).not.toHaveProperty('hack');
    });
});