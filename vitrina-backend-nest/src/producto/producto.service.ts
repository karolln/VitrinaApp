import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { CrearProductoFotoDto } from './dto/crear-producto-foto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Injectable()
export class ProductoService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Autorización: el negocio debe existir y ser del usuario que hace la petición.
   */
  private async verificarDuenoDelNegocio(negocioId: number, usuarioId: number) {
    const negocio = await this.prisma.negocio.findUnique({ where: { id: negocioId } });
    if (!negocio) throw new NotFoundException('El negocio indicado no existe');
    if (negocio.usuarioId !== usuarioId) {
      throw new ForbiddenException('Este negocio no es tuyo');
    }
    return negocio;
  }

  /**
   * Autorización: el producto debe existir y pertenecer a un negocio del usuario.
   */
  private async buscarProductoPropio(id: number, usuarioId: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { negocio: { select: { usuarioId: true } } },
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    if (producto.negocio.usuarioId !== usuarioId) {
      throw new ForbiddenException('Este producto no es de tu negocio');
    }
    return producto;
  }

  /**
   * HU-05 — Agregar producto tomando una foto
   */
  async crearConFoto(
    dto: CrearProductoFotoDto,
    fotoUrl: string,
    sugerencia: { nombre: string; categoria: string },
    usuarioId: number,
  ) {
    await this.verificarDuenoDelNegocio(dto.negocioId, usuarioId);

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
  async crear(dto: CrearProductoDto, usuarioId: number) {
    await this.verificarDuenoDelNegocio(dto.negocioId, usuarioId);

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
   * HU-09 — Ver listado de productos (público: lo usan los vecinos)
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
  async cambiarEstado(id: number, usuarioId: number) {
    const producto = await this.buscarProductoPropio(id, usuarioId);
    const nuevoEstado = producto.estado === 'disponible' ? 'agotado' : 'disponible';

    return this.prisma.producto.update({
      where: { id },
      data: { estado: nuevoEstado },
    });
  }

  /**
   * HU-06 — Editar producto
   */
  async actualizar(id: number, dto: ActualizarProductoDto, usuarioId: number) {
    await this.buscarProductoPropio(id, usuarioId);

    const { nombre, categoria, fotoUrl, cantidad } = dto;
    if (
      nombre === undefined &&
      categoria === undefined &&
      fotoUrl === undefined &&
      cantidad === undefined
    ) {
      throw new BadRequestException('Envía al menos un campo para editar');
    }

    return this.prisma.producto.update({
      where: { id },
      data: { nombre, categoria, fotoUrl, cantidad },
    });
  }
}