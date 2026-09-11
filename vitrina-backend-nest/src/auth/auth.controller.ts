import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { CompletarPerfilDto } from './dto/completar-perfil.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsuarioActual } from './guards/usuario-actual.decorator';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { VerificarCodigoDto } from './dto/verificar-codigo.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Autenticación (HU-01, HU-02, HU-03, HU-04)')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @ApiOperation({ summary: 'HU-01: Registro con número de celular' })
  registrar(@Body() dto: RegistroDto) {
    return this.authService.registrar(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'HU-02: Iniciar sesión' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('recuperar/solicitar')
  @ApiOperation({ summary: 'HU-03 Paso 1: Solicitar código de recuperación' })
  solicitarRecuperacion(@Body() dto: SolicitarRecuperacionDto) {
    return this.authService.solicitarRecuperacion(dto);
  }

  @Post('recuperar/verificar')
  @ApiOperation({ summary: 'HU-03 Paso 2: Verificar código' })
  verificarCodigo(@Body() dto: VerificarCodigoDto) {
    return this.authService.verificarCodigo(dto);
  }

  @Post('recuperar/reset')
  @ApiOperation({ summary: 'HU-03 Paso 3: Establecer nueva contraseña' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('completar-perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'HU-04: Completar perfil del negocio (requiere token)' })
  completarPerfil(
    @UsuarioActual() usuario: { id: number; telefono: string },
    @Body() dto: CompletarPerfilDto,
  ) {
    return this.authService.completarPerfil(usuario.id, dto);
  }
}
