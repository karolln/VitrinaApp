import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(dto: RegistroDto) {
    const existente = await this.prisma.usuario.findUnique({
      where: { celular: dto.celular },
    });

    if (existente) {
      throw new ConflictException('Ya existe una cuenta registrada con ese número de celular');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: { nombre: dto.nombre, celular: dto.celular, passwordHash },
    });

    const { passwordHash: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { celular: dto.celular },
    });

    if (!usuario) {
      throw new UnauthorizedException('Celular o contraseña incorrectos');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Celular o contraseña incorrectos');
    }

    const token = this.jwtService.sign({ sub: usuario.id, celular: usuario.celular });

    return { access_token: token };
  }
}