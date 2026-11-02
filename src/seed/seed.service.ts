import { Injectable } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    // ? injeccion del servicion
    private readonly productService: ProductsService
  ){}
  
  // * METODO QUE EJECUTA LA SEED
  async runSeed() {
    await this.insertNewProducts();
    return `SEED EXECUTED`;
  }

  // * METODO QUE RECONTRUYE LA DB CON NUEVA DATA
  private async insertNewProducts(){
    // ? eliminacion de lo que existe
    await this.productService.deleteAllProducts();

    // ? array de seed product(luce como el create dto)
    const products = initialData.products;

    // ? array que usaremos para insertar cada product (promises)
    const inserPromises: any = [];

    // ? barremos cada product, y lo que hacemos es que insertamos cada product
    // ? y luego ejecutamos, son promesas aun no resueltas
    products.forEach((product) => {
      inserPromises.push(this.productService.create( product ));
    });

    // ? aqui es donde se resuelve cada promesa (create many in db)
    // ? un solo insert en lugar de multiples queries
    await Promise.all( inserPromises );
  }

}
