import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/crear-producto.dto';

@ApiTags('Catálogo (HU-01, HU-02, HU-03)')
@Controller('api/productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @ApiOperation({ summary: 'HU-01: Agregar producto por foto' })
  crear(@Body() dto: CrearProductoDto) {
    return this.productoService.crear(dto);
  }

  @Get('negocio/:negocioId')
  @ApiOperation({ summary: 'HU-02: Ver listado de productos de un negocio' })
  listarPorNegocio(@Param('negocioId', ParseIntPipe) negocioId: number) {
    return this.productoService.listarPorNegocio(negocioId);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'HU-03: Alternar estado disponible/agotado' })
  cambiarEstado(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.cambiarEstado(id);
  }
}
