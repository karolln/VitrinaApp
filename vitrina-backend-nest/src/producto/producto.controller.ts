import {
  Body, Controller, Get, Param, ParseIntPipe, Patch, Post,
  UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'; // <-- agregar ApiBody
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/crear-producto.dto';

@ApiTags('Catálogo (HU-01, HU-02, HU-03)')
@Controller('api/productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @ApiOperation({ summary: 'HU-01: Agregar producto por foto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Arroz Diana 500g' },
        categoriaId: { type: 'number', example: 1 },
        cantidad: { type: 'number', example: 1 },
        negocioId: { type: 'number', example: 1 },
        foto: { type: 'string', format: 'binary' }, // <-- esto hace aparecer el selector de archivo
      },
      required: ['categoriaId', 'negocioId', 'foto'],
    },
  })
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/productos',
        filename: (req, file, callback) => {
          const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          callback(null, nombreUnico);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, webp)'), false);
        }
        callback(null, true);
      },
    }),
  )
  crear(@Body() dto: CrearProductoDto, @UploadedFile() foto: Express.Multer.File) {
    if (!foto) throw new BadRequestException('La foto del producto es obligatoria');
    const fotoUrl = `/uploads/productos/${foto.filename}`;
    return this.productoService.crear(dto, fotoUrl);
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