import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { CrearProductoFotoDto } from './dto/crear-producto-foto.dto';
import { GeminiVisionService } from '../integraciones/gemini-vision/gemini-vision.service';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsuarioActual } from '../auth/guards/usuario-actual.decorator';

type UsuarioToken = { id: number; telefono: string };

@ApiTags('Catálogo (HU-05, HU-08, HU-09)')
@Controller('api/productos')
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly geminiVision: GeminiVisionService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar producto manualmente (solo el dueño del negocio)' })
  crear(@UsuarioActual() usuario: UsuarioToken, @Body() dto: CrearProductoDto) {
    return this.productoService.crear(dto, usuario.id);
  }

  @Post('con-foto')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'HU-05: Agregar producto tomando una foto (solo el dueño del negocio)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        foto: { type: 'string', format: 'binary' },
        negocioId: { type: 'number' },
        cantidad: { type: 'number' },
        nombre: { type: 'string' },
        categoria: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/productos',
        filename: (_req, file, cb) => {
          const sufijo = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${sufijo}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
    }),
  )
  async crearConFoto(
    @UsuarioActual() usuario: UsuarioToken,
    @UploadedFile() foto: Express.Multer.File,
    @Body() dto: CrearProductoFotoDto,
  ) {
    if (!foto) throw new BadRequestException('Debes subir una foto del producto');

    const sugerencia = await this.geminiVision.sugerirDesdeFoto(foto.path, foto.mimetype);
    const fotoUrl = `/uploads/productos/${foto.filename}`;

    return this.productoService.crearConFoto(dto, fotoUrl, sugerencia, usuario.id);
  }

  @Get('negocio/:negocioId')
  @ApiOperation({ summary: 'HU-09: Ver listado de productos de un negocio (público)' })
  listarPorNegocio(@Param('negocioId', ParseIntPipe) negocioId: number) {
    return this.productoService.listarPorNegocio(negocioId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'HU-06: Editar producto (solo el dueño)' })
  editar(
    @UsuarioActual() usuario: UsuarioToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarProductoDto,
  ) {
    return this.productoService.actualizar(id, dto, usuario.id);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'HU-08: Alternar estado disponible/agotado (solo el dueño)' })
  cambiarEstado(@UsuarioActual() usuario: UsuarioToken, @Param('id', ParseIntPipe) id: number) {
    return this.productoService.cambiarEstado(id, usuario.id);
  }
}