import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { CompletarPerfilDto } from './dto/completar-perfil.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async registrar(dto: RegistroDto) {
    const existente = await this.prisma.usuario.findUnique({
      where: { telefono: dto.telefono },
    });

    if (existente) {
      throw new ConflictException('Ya existe una cuenta registrada con ese número de teléfono');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: { nombre: dto.nombre, telefono: dto.telefono, passwordHash },
    });

    const { passwordHash: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { telefono: dto.telefono },
    });

    if (!usuario) {
      throw new UnauthorizedException('Teléfono o contraseña incorrectos');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Teléfono o contraseña incorrectos');
    }

    const token = this.jwtService.sign({ sub: usuario.id, telefono: usuario.telefono });

    return { access_token: token };
  }

  async completarPerfil(usuarioId: number, dto: CompletarPerfilDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { negocio: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (usuario.negocio) {
      return this.prisma.negocio.update({
        where: { id: usuario.negocio.id },
        data: {
          nombre: dto.nombreNegocio,
          barrio: dto.barrio,
          descripcion: dto.descripcion,
          latitud: dto.latitud,
          longitud: dto.longitud,
        },
      });
    }

    return this.prisma.negocio.create({
      data: {
        nombre: dto.nombreNegocio,
        barrio: dto.barrio,
        descripcion: dto.descripcion,
        latitud: dto.latitud,
        longitud: dto.longitud,
        usuarioId,
      },
    });
  }
}