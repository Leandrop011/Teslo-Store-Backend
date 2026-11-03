import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  
    public getStaticProductImage( imageName: string ) {
        // ? path fisico de la image que se busca, navegamos hacia el directorio
        // ? y buscamos por el name
        const path = join(__dirname, '../../static/products', imageName);

        // ? si no existe manda error
        if (!existsSync(path)) 
            throw new BadRequestException(`No product fount with image name: ${imageName}`);

        // ? devuelve el path
        return path;
    }

}
