import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';

@ApiTags('Autenticación (HU-01, HU-02)')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @ApiOperation({ summary: 'HU-01: Registro con número de celular' })
  registrar(@Body() dto: RegistroDto) {
    return this.authService.registrar(dto);
  }
}