import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearProductoDto {
  @ApiPropertyOptional({ example: 'Arroz Diana 500g' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 1, description: 'Id de la categoría del producto' })
  @Type(() => Number)
  @IsInt()
  categoriaId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidad?: number;

  @ApiProperty({ example: 1, description: 'Id del negocio dueño del producto' })
  @Type(() => Number)
  @IsInt()
  negocioId: number;
}