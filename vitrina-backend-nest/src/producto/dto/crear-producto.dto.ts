import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CrearProductoDto {
  @ApiPropertyOptional({ example: 'Arroz Diana 500g' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Abarrotes' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ example: 'https://storage.vitrina.app/fotos/arroz.jpg' })
  @IsString()
  fotoUrl!: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  cantidad?: number;

  @ApiPropertyOptional({ example: 2500, description: 'Precio en pesos colombianos, sin decimales' })
  @IsOptional()
  @IsInt()
  @Min(0)
  precio?: number;

  @ApiProperty({ example: 1, description: 'Id del negocio dueño del producto' })
  @IsInt()
  negocioId!: number;
}
