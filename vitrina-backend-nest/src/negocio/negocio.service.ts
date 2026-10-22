import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NegocioService {
  constructor(private readonly prisma: PrismaService) {}

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

  async registrarVisita(id: number) {
    const negocio = await this.prisma.negocio.findUnique({
      where: { id },
    });

    if (!negocio) throw new NotFoundException('Negocio no encontrado');

    await this.prisma.visita.create({
      data: { negocioId: id },
    });

    return { message: 'Visita registrada exitosamente' };
  }

  async obtenerEstadisticas(id: number) {
    const negocio = await this.prisma.negocio.findUnique({
      where: { id },
    });

    if (!negocio) throw new NotFoundException('Negocio no encontrado');

    const totalVisitas = await this.prisma.visita.count({
      where: { negocioId: id },
    });

    return {
      negocioId: id,
      nombreNegocio: negocio.nombre,
      totalVisitas,
    };
  }
}
