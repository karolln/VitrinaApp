import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ActualizarProductoDto {
  @ApiPropertyOptional({ example: 'Arroz Diana 1kg' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Abarrotes' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoria?: string;

  @ApiPropertyOptional({ example: 'https://storage.vitrina.app/fotos/arroz.jpg' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fotoUrl?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  cantidad?: number;
}