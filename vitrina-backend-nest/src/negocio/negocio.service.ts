import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NegocioService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * HU-10 — Perfil público del negocio
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
   * HU-12 — Buscar negocios por nombre o ubicación
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

  /**
   * HU-11 — Compartir negocio por WhatsApp
   */
    async generarLinkCompartir(id: number) {
    const negocio = await this.prisma.negocio.findUnique({
      where: { id },
      include: { usuario: { select: { telefono: true } } },
    });
    if (!negocio) {
      throw new NotFoundException('Negocio no encontrado');
    }

    const base =
      process.env.PUBLIC_BASE_URL ?? 'https://vitrina-dev.apolobyte.online';
    const url = `${base}/api/negocios/${negocio.id}`;

    const telefono = negocio.usuario.telefono.replace(/\D/g, '');
    const contactoWhatsapp = `https://wa.me/57${telefono}`;

    const mensaje =
      `¡Mira mi negocio "${negocio.nombre}" en VitrinaApp! 🛍️ ${url}\n` +
      `Escríbeme por WhatsApp: ${contactoWhatsapp}`;

    return {
      url,
      contactoWhatsapp,
      mensaje,
      whatsappUrl: `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
    };
  }
}
// Revision HU-10 Santiago