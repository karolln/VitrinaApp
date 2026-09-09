import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NegocioService } from './negocio.service';

@ApiTags('Visibilidad (HU-04, HU-05)')
@Controller('api/negocios')
export class NegocioController {
  constructor(private readonly negocioService: NegocioService) {}

  @Get('buscar')
  @ApiOperation({ summary: 'HU-05: Buscar negocios por nombre o barrio' })
  @ApiQuery({ name: 'nombre', required: false })
  @ApiQuery({ name: 'barrio', required: false })
  buscar(@Query('nombre') nombre?: string, @Query('barrio') barrio?: string) {
    return this.negocioService.buscar(nombre, barrio);
  }

  @Get(':id')
  @ApiOperation({ summary: 'HU-04: Ver perfil público del negocio' })
  perfilPublico(@Param('id', ParseIntPipe) id: number) {
    return this.negocioService.perfilPublico(id);
  }
}
