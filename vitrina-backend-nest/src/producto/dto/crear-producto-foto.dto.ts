import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearProductoFotoDto {
  @Type(() => Number)
  @IsInt()
  negocioId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidad?: number;

  // Precio en pesos colombianos, sin decimales. Llega como texto en el formulario.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  precio?: number;

  // Si el usuario edita la sugerencia antes de guardar, se manda esto y se respeta
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  categoria?: string;
}
