import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { CrearProductoFotoDto } from './dto/crear-producto-foto.dto';

@Injectable()
export class ProductoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * HU-05 — Agregar producto tomando una foto
   */
  async crearConFoto(
    dto: CrearProductoFotoDto,
    fotoUrl: string,
    sugerencia: { nombre: string; categoria: string },
  ) {
    const negocio = await this.prisma.negocio.findUnique({ where: { id: dto.negocioId } });
    if (!negocio) throw new NotFoundException('El negocio indicado no existe');

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
    /**
   * Agregar producto manualmente (sin foto)
   */
  async crear(dto: CrearProductoDto) {
    const negocio = await this.prisma.negocio.findUnique({ where: { id: dto.negocioId } });
    if (!negocio) throw new NotFoundException('El negocio indicado no existe');

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
  /**
   * HU-09 — Ver listado de productos
   */
  async listarPorNegocio(negocioId: number) {
    return this.prisma.producto.findMany({
      where: { negocioId },
      orderBy: { creadoEn: 'desc' },
    });
  }

  /**
   * HU-08 — Marcar producto como agotado (toggle en un solo toque)
   */
  async cambiarEstado(id: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const nuevoEstado = producto.estado === 'disponible' ? 'agotado' : 'disponible';

    return this.prisma.producto.update({
      where: { id },
      data: { estado: nuevoEstado },
    });
  }
}
