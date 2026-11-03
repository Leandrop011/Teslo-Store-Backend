import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Express, Response } from 'express';

import { FilesService } from './files.service';
import { fileNamer, fileFilter } from './helpers/index';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  // * ENDPOINT QUE DEVUELVE UNA IMAGE QUE YA SE CREO O ERROR
  @Get('product/:imageName')
  findProductImage(
    // ? usamos res para controlar por completo de inicio a fin la response
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    // ? usamos res para que deuelva la image en el path encontrado
    res.sendFile(path);
  }

  // * ENDPOINT QUE CARGA ARCHIVOS
  @Post('product')
  // ? usamos este interceptor para procesar los archivos
  // ? validar, guardar y asignar el nombre con su extension
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter, // ? filtro de los files
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer, // ? tambien requiere una function para asignacion del name
      }),
    }),
  )
  uploadProductImage(
    // ? usamos multer para el manejo de archivos
    // ? y usamos ese decorador para obtener el file
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that file is an image?');
    }

    // ? enlace a la image
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return { secureUrl };
  }
}
