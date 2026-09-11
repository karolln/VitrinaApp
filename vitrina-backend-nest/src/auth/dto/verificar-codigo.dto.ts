import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerificarCodigoDto {
  @ApiProperty({ example: '3001234567' })
  @IsString()
  celular!: string;

  @ApiProperty({ example: '482913' })
  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  codigo!: string;
}