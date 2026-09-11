import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: '3001234567' })
  @IsString()
  celular!: string;

  @ApiProperty({ example: '482913' })
  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  codigo!: string;

  @ApiProperty({ example: 'NuevaPassword123' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  nuevaPassword!: string;
}