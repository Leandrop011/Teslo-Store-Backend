import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities/index';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([
      Product, // ? IMPORTAMOS LA ENTIDAD PRODUCT PARA QUE SE CREE EN LA DB
      ProductImage,
    ])
  ],
  exports: [
    ProductsService,
    TypeOrmModule // ? usar los repositorios
  ]
})
export class ProductsModule {}
