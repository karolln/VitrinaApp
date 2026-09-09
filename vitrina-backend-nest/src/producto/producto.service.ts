import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Injectable()
export class ProductoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * HU-01 — Agregar producto por foto
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
   * HU-02 — Ver listado de productos
   */
  async listarPorNegocio(negocioId: number) {
    return this.prisma.producto.findMany({
      where: { negocioId },
      orderBy: { creadoEn: 'desc' },
    });
  }

  /**
   * HU-03 — Marcar producto como agotado (toggle en un solo toque)
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
