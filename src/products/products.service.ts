import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger, 
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {validate as isUUID} from 'uuid'
import { Repository } from 'typeorm';

import { ProductImage, Product } from './entities/index';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';


@Injectable()
export class ProductsService {

  // * PROPIEDAD LOGGER PARA GENERAR 'MEJORES' LOGS
  private readonly logger = new Logger('ProductsService');

  constructor(
    // * injeccion del repository (ejecutar acciones en esa table(Product))
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // * data source es de typeorm, y nos permite sabes que cadena de conexion 
    // * se tiene, que usuario se tiene, que constrasena se configuro, etc
    private readonly dataSource: DataSource,

  ){}

  // * SERVICIO QUE OBTIENE UNA CANTIDAD DE PRODUCTOS DEPENDIENDO DEL LIMIT Y OFFSET
  // * QUE VIENEN EN EL DTO
  async findAll( paginationDTO: PaginationDTO ) {
    try {
      const products = await this.productRepository.find({
        take: paginationDTO.limit ?? 10, // ? limit
        skip: paginationDTO.offset ?? 0, // ? offset
        relations: { // ? devolver las images que posiblemente tenga ese product
          images: true
        },
      });

      // ? aplanar las images a solo el url, devolvemos el objeto
      return products.map((product) => ({
        ...product,
        images: product.images?.map((img) => img.url),
      }));

    } catch (error) {
      this.handleDBExeptions(error);
    }
  }
  
  // * SERVICIO QUE BUSCA UN PRODUCT SEGUN SU ID
  async findOne(term: string) {
    // ? product
    let product: Product | null;

    try {

      // ? buscar el product segun el id
      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({id: term}); 
      }else {
        // ? esta forma de buscar el title y el slug nos permite
        // ? evitar apostofres y evitar sql injection
        const queryBuilder = this.productRepository.createQueryBuilder('prod');

        // ? con esto obtendremos un registro de product,
        // ? segun si el title coincide o el slug
        product = await queryBuilder
        // ! VA A DEOLVER O EL TITLE O EL SLUG
          // * realizar un where en sql :term
          // * usamos UPPER para que title no sea case sensitive
          .where('UPPER(title)=:title or slug=:slug', {
            title: term.toUpperCase(), // * definicion y asignacion del term
            slug: term.toLowerCase(),
          })
          // * esto se lo realiza pq al querer incluir los resultados de nuestra tabla hija
          // * es necesario hacer esto cuando se utiliza querybuilder para aceceder a la data
          .leftJoinAndSelect('prod.images', 'prodImages') 
          .getOne(); // * solo obtener 1
      }
      
      // ? si no se inicializao el object siginifica que no encontro nada
      if (!product) {
        throw '404';
      }
  
      return product;
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  // * SERVICIO QUE INSERTA UN REGISTRO EN LA ENTIDAD PRODUCT DE NUESTRA DB (CON REFERENCIA A UN USER)
  async create(createProductDto: CreateProductDto, user: User) {

    const {images = [], ...productDetails} = createProductDto;

    try {
      // ? crear instancia para insercion futura ( para crear el registro se debe tener 
      // ? las mismas propiedades en el dto que la entidad )
      // ! (aqui se ejecuta el beforetoinsert)
      const product = this.productRepository.create({
          ...productDetails, 
          // * ingresamos y creamos las images, creamos instancias de ProductImage
          // * para la creacion solo se necesita la url, no el product (id) porque typeorm
          // * infiere en este momento de creacion esta dentro del product, entonces lo asigna a esa image ese id
          images: images.map( (image) => this.productImageRepository.create( { url: image } ) ),
          user: user
        }
      );
      
      // ? insercion en la base de datos
      await this.productRepository.save( product );
      
      // ? retorno del productgo insertado (retornabos en las images solo el listado de images, no con el id)
      return {...product, images};
    } catch (error: any) {
      console.log(error)
      this.handleDBExeptions(error);
    }
    
  }
  
  
  // * SERVICIO QUE ACTUALIZA UN PRODUCT SEGUN EL ID Y LO QUE TENGA EN EL DTO (CON REFERENCIA A UN USER)
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const {images, ...toUpdate} = updateProductDto
    
    // ? buscamos y cargamos con las propiedades del dto el product
    // * esto nos evita en buscar y luego hacer el spreed de las propiedades separadas
    const product = await this.productRepository.preload({
      id: id, // * busqueda
      ...toUpdate, // * carga
      user: user // * usuario que realizo la accion
    });

    // ? si no lo encuentra, mandamos una exception
    if( !product ) 
      throw new NotFoundException(`Error, el producto con id: ${id}, no fue encontrado.`);
 
    // * query runner nos permite evaluar condiciones que si se cumplen
    // * impacten en la bd, pero si no se cumplen, no la toca
    const queryRunner =  this.dataSource.createQueryRunner();

    // ? transaccion
    // * nos conectamos a la db
    await queryRunner.connect();
    // * iniciamos una transaccion
    await queryRunner.startTransaction();

    try {
      // * si vienen imagenes lo que hacemos es, eliminar(pero manteniendo la integridad referencial)
      // * eliminar todas las filas de ProductImage, que posean en su colum product el mismo id que 
      // * se le pasa por parametro aqui (id update) 
      if (images) {
        // ? eliminamos las anteriores
        await queryRunner.manager.delete( ProductImage, { product: {id: id} } )
        // ? damos un value a las imagenes ( las nuevas )
        product.images = images.map(
          (image) => this.productImageRepository.create({url: image})
        )
      }

      // * guarda el producto(aun no impacta)
      await queryRunner.manager.save( product );

      // * realiza el commit a la database( impacta y guarda )
      await queryRunner.commitTransaction();

      // * terminamos la conexion con la db y el queryrunner
      await queryRunner.release();

      // * retornamos el objeto plano buscado con el metodo segun un id-
      return this.findOnePlain(id);
    } catch (error) {
      
      // ! si llega a haber un error de la db
      // * realizamos un rollback
      await queryRunner.rollbackTransaction();
      // * y terminamos conexion
      await queryRunner.release();

      this.handleDBExeptions(error);
    }
  }

  // * SERVICIO QUE ELIMINA UN PRODUCT SEGUN EL ID
  async remove(id: string) {
    
    try {
      // ? eliminar segun el id
      const product = await this.productRepository.delete({id: id}); 
      // ? desestructurar el object
      const { affected } = product;
      
      // ? si es === 0 significa que no borro nada (no encontro nada)
      if (affected === 0) {
        throw '404'; // * slata al catch con ese error
      }

      return {
        status: 'Eliminado'
      };
    } catch (error: any) {
      this.handleDBExeptions(error);
    }

  }

  // * METODO QUE APLANA LA BUSQUEDA DE PRODUCTOS SEGUN UN TERM
  async findOnePlain(term: string){
    const product = await this.findOne(term);

    return {
      ...product,
      images: product?.images?.map((image) => image.url),
    }
  }

  // * METODO QUE MANEJARA LOS DISTINTOS ERRORES Y SI NO ENCUENTRA UNO, REGRESA UNO GENERICO(INTERNAL ERROR)
  private handleDBExeptions(error: any){
    if (error.code ==='23505') {
      throw new BadRequestException(`Error: ${error.detail}`)
    }
    if (error.code === '404') {
      throw new NotFoundException('Error, no se encontro ese product');
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check server logs.`)
  }

  // * METODO QUE ELIMINARA TODOS LOS PRODUCTOS EN CASCADA
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('prod');

    try {
      return await query
        .delete()
        .execute()
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

}
