import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NegocioService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * HU-04 — Perfil público del negocio
   */
  async perfilPublico(id: number) {
    const negocio = await this.prisma.negocio.findUnique({
      where: { id },
      include: { productos: { where: { estado: 'disponible' } } },
    });

    if (!negocio) throw new NotFoundException('Negocio no encontrado');

    return {
      id: negocio.id,
      nombre: negocio.nombre,
      barrio: negocio.barrio,
      descripcion: negocio.descripcion,
      catalogoEnConstruccion: negocio.productos.length === 0,
      productos: negocio.productos,
    };
  }

  /**
   * HU-05 — Buscar negocios por nombre o ubicación
   */
  async buscar(nombre?: string, barrio?: string) {
    return this.prisma.negocio.findMany({
      where: {
        AND: [
          nombre ? { nombre: { contains: nombre, mode: 'insensitive' as const } } : {},
          barrio ? { barrio: { equals: barrio, mode: 'insensitive' as const } } : {},
        ],
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
