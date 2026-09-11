import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CompletarPerfilDto {
  @ApiProperty({ example: 'Tienda Doña Lucía' })
  @IsString()
  @MinLength(2)
  nombreNegocio: string;

  @ApiProperty({ example: 'La Esmeralda' })
  @IsString()
  barrio: string;

  @ApiPropertyOptional({ example: 'Abarrotes, víveres y productos de aseo' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 2.4448 })
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiPropertyOptional({ example: -76.6147 })
  @IsOptional()
  @IsNumber()
  longitud?: number;
}
