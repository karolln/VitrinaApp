import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as fs from 'fs';
import { join, resolve } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { CrearProductoFotoDto } from './dto/crear-producto-foto.dto';

@Injectable()
export class ProductoService {
  constructor(private readonly prisma: PrismaService) {}

  private async validarNegocioDelUsuario(negocioId: number, usuarioId: number) {
    const negocio = await this.prisma.negocio.findUnique({ where: { id: negocioId } });
    if (!negocio) throw new NotFoundException('El negocio indicado no existe');

    if (negocio.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para modificar este negocio');
    }

    return negocio;
  }

  async crear(dto: CrearProductoDto, usuarioId: number) {
    await this.validarNegocioDelUsuario(dto.negocioId, usuarioId);

    return this.prisma.producto.create({
      data: {
        nombre: dto.nombre || 'Producto sin nombre',
        categoria: dto.categoria || 'Sin categoría',
        fotoUrl: dto.fotoUrl,
        cantidad: dto.cantidad ?? 1,
        estado: 'disponible',
        negocioId: dto.negocioId,
      },
    });
  }

  async crearConFoto(
    dto: CrearProductoFotoDto,
    fotoUrl: string,
    sugerencia: { nombre: string; categoria: string },
    usuarioId: number,
  ) {
    await this.validarNegocioDelUsuario(dto.negocioId, usuarioId);

    return this.prisma.producto.create({
      data: {
        nombre: dto.nombre || sugerencia.nombre,
        categoria: dto.categoria || sugerencia.categoria,
        fotoUrl,
        cantidad: dto.cantidad ?? 1,
        estado: 'disponible',
        negocioId: dto.negocioId,
      },
    });
  }

  async listarPorNegocio(negocioId: number) {
    return this.prisma.producto.findMany({
      where: { negocioId },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async cambiarEstado(id: number, usuarioId: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    await this.validarNegocioDelUsuario(producto.negocioId, usuarioId);

    const nuevoEstado = producto.estado === 'disponible' ? 'agotado' : 'disponible';

    return this.prisma.producto.update({
      where: { id },
      data: { estado: nuevoEstado },
    });
  }

  /**
   * HU-07 — Eliminar producto (solo el dueño del negocio)
   */
  async eliminar(id: number, usuarioId: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    await this.validarNegocioDelUsuario(producto.negocioId, usuarioId);

    await this.prisma.producto.delete({ where: { id } });

    if (producto.fotoUrl) {
      const carpetaUploads = resolve(process.cwd(), 'uploads');
      const rutaFoto = resolve(join(process.cwd(), producto.fotoUrl));

      if (rutaFoto.startsWith(carpetaUploads)) {
        fs.promises.unlink(rutaFoto).catch(() => {});
      }
    }

    return { mensaje: 'Producto eliminado correctamente', id };
  }
}