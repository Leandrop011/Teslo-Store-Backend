import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRolesEnum } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';

@Controller('products')
@Auth() // ? es necesario que este autenticado para que use cualquier ruta
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ! ENDPOINT POST QUE CREA UN NUEVO PRODUCT (PROTEGIDA)
  @Post()
  @Auth(ValidRolesEnum.admin)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  // ! ENDPOINT GET QUE OBTIENE UNA CANTIDAD DE PRODUCT (PAGINADOS) (REQUIERE AUTHENTICATION)
  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.productsService.findAll(paginationDTO);
  }

  // ! ENDPOINT GET QUE OBTIENE UN PRODUCT POR ID (REQUIERE AUTHENTICATION (JWT))
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  // ! ENDPOINT PATCH QUE ACTUALIZA UN PRODUCT POR ID (PROTEGIDA)
  @Patch(':id')
  @Auth(ValidRolesEnum.admin)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User // ? decorador qu eobtiene el user que esta realizando esa accion
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  // ! ENDPOINT DELETE QUE ELIMINA UN PRODUCT POR ID (PROTEGIDA)
  @Delete(':id')
  @Auth(ValidRolesEnum.admin, ValidRolesEnum.superUser)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.productsService.remove(id);
  }
}
