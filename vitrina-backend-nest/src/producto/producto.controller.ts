import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/crear-producto.dto';

@ApiTags('Catálogo (HU-05, HU-08, HU-09)')
@Controller('api/productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @ApiOperation({ summary: 'HU-05: Agregar producto por foto' })
  crear(@Body() dto: CrearProductoDto) {
    return this.productoService.crear(dto);
  }

  @Get('negocio/:negocioId')
  @ApiOperation({ summary: 'HU-09: Ver listado de productos de un negocio' })
  listarPorNegocio(@Param('negocioId', ParseIntPipe) negocioId: number) {
    return this.productoService.listarPorNegocio(negocioId);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'HU-08: Alternar estado disponible/agotado' })
  cambiarEstado(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.cambiarEstado(id);
  }
}
