import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class SolicitarRecuperacionDto {
  @ApiProperty({ example: '3001234567' })
  @IsString()
  @Matches(/^3\d{9}$/, { message: 'El celular debe tener 10 dígitos y empezar por 3' })
  celular!: string;
}