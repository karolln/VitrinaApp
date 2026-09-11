import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class RegistroDto {
  @ApiProperty({ example: 'María Fernández' })
  @IsString()
  @MinLength(2)
  nombre: string;

  @ApiProperty({ example: '3001234567', description: 'Número de teléfono (10 dígitos, Colombia)' })
  @IsString()
  @Matches(/^3\d{9}$/, { message: 'El teléfono debe tener 10 dígitos y empezar por 3' })
  telefono: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}