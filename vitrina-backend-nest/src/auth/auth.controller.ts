import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Autenticación (HU-01, HU-02)')
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
}