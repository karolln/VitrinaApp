import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { VerificarCodigoDto } from './dto/verificar-codigo.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
    /**
   * HU-03 — Paso 1: Solicitar código de recuperación
   */
  async solicitarRecuperacion(dto: SolicitarRecuperacionDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { celular: dto.celular },
    });

    if (!usuario) {
      throw new NotFoundException('No existe una cuenta registrada con ese celular');
    }

    const codigo = crypto.randomInt(100000, 999999).toString();
    const expiraEn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    await (this.prisma as any).codigoRecuperacion.create({
      data: { celular: dto.celular, codigo, expiraEn },
    });

    // Simulado: en producción esto se enviaría por SMS/WhatsApp real.
    console.log(`[Recuperación] Código para ${dto.celular}: ${codigo}`);

    return {
      mensaje: 'Código generado correctamente',
      // Solo para pruebas: en producción NUNCA se devuelve el código en la respuesta.
      codigoSimulado: codigo,
      expiraEn,
    };
  }

  /**
   * HU-03 — Paso 2: Verificar código
   */
  async verificarCodigo(dto: VerificarCodigoDto) {
    const registro = await (this.prisma as any).codigoRecuperacion.findFirst({
      where: { celular: dto.celular, codigo: dto.codigo, usado: false },
      orderBy: { creadoEn: 'desc' },
    });

    if (!registro) {
      throw new BadRequestException('Código incorrecto o ya utilizado');
    }

    if (registro.expiraEn < new Date()) {
      throw new BadRequestException('El código expiró, solicita uno nuevo');
    }

    return { valido: true, mensaje: 'Código verificado correctamente' };
  }

  //3
  async resetPassword(dto: ResetPasswordDto) {
    const registro = await (this.prisma as any).codigoRecuperacion.findFirst({
      where: { celular: dto.celular, codigo: dto.codigo, usado: false },
      orderBy: { creadoEn: 'desc' },
    });

    if (!registro) {
      throw new BadRequestException('Código incorrecto o ya utilizado');
    }

    if (registro.expiraEn < new Date()) {
      throw new BadRequestException('El código expiró, solicita uno nuevo');
    }

    const usuario = await this.prisma.usuario.findUnique({ where: { celular: dto.celular } });
    if (!usuario) {
      throw new NotFoundException('No existe una cuenta registrada con ese celular');
    }

    const passwordHash = await bcrypt.hash(dto.nuevaPassword, 10);

    await this.prisma.usuario.update({
      where: { celular: dto.celular },
      data: { passwordHash },
    });

    await (this.prisma as any).codigoRecuperacion.update({
      where: { id: registro.id },
      data: { usado: true },
    });

    return { mensaje: 'Contraseña actualizada correctamente' };
  }
}