import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { CompletarPerfilDto } from './dto/completar-perfil.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsuarioActual } from './guards/usuario-actual.decorator';

@ApiTags('Autenticación (HU-01, HU-02, HU-04)')
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
