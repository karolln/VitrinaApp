import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from './dto/registro.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * HU-01 — Registro con número de celular
   */
  async registrar(dto: RegistroDto) {
    const existente = await this.prisma.usuario.findUnique({
      where: { celular: dto.celular },
    });

    if (existente) {
      throw new ConflictException('Ya existe una cuenta registrada con ese número de celular');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        celular: dto.celular,
        passwordHash,
      },
    });

    // Nunca devolver el hash de la contraseña en la respuesta
    const { passwordHash: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}