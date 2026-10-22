import { Controller, Get, Param, ParseIntPipe, Query, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NegocioService } from './negocio.service';

@ApiTags('Visibilidad (HU-10, HU-12, HU-13)')
@Controller('api/negocios')
export class NegocioController {
  constructor(private readonly negocioService: NegocioService) {}

  @Get('buscar')
  @ApiOperation({ summary: 'HU-12: Buscar negocios por nombre o barrio' })
  @ApiQuery({ name: 'nombre', required: false })
  @ApiQuery({ name: 'barrio', required: false })
  buscar(@Query('nombre') nombre?: string, @Query('barrio') barrio?: string) {
    return this.negocioService.buscar(nombre, barrio);
  }

  @Get(':id')
  @ApiOperation({ summary: 'HU-10: Ver perfil público del negocio' })
  perfilPublico(@Param('id', ParseIntPipe) id: number) {
    return this.negocioService.perfilPublico(id);
  }

  @Post(':id/visita')
  @ApiOperation({ summary: 'HU-13: Registrar una visita al negocio' })
  registrarVisita(@Param('id', ParseIntPipe) id: number) {
    return this.negocioService.registrarVisita(id);
  }

  @Get(':id/estadisticas')
  @ApiOperation({ summary: 'HU-13: Ver estadísticas de visitas al negocio' })
  obtenerEstadisticas(@Param('id', ParseIntPipe) id: number) {
    return this.negocioService.obtenerEstadisticas(id);
  }
}
