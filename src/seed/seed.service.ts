import { Injectable } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    // ? injeccion del servicion
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // * METODO QUE EJECUTA LA SEED
  async runSeed() {
    // ? eliminacion de todo el contenido de las tablas
    await this.deleteTables();

    // ? obtenemos e insertamos los nuevos users
    const adminUser = await this.inserUsers();

    // ? insertamos nuevos products
    await this.insertNewProducts(adminUser);
    return `SEED EXECUTED`;
  }

  // * METODO QUE ELIMINA LOS REGISTROS DE LOS PRODUCTOS Y USERS
  private async deleteTables() {
    // ? products delete
    await this.productService.deleteAllProducts();

    // ? users delete
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().execute();
  }

  // * METODO QUE INSERTA EN LA TABLA USERS NUEVOS USUARIOS DE SEED USERS
  private async inserUsers() {
    const seedUsers = initialData.users;

    // ? array de users vacio
    const users: User[] = [];

    // ? seed users cada elemento para el array y creacion de los user para la db
    seedUsers.forEach((user) => {
      const {password, ...userData} = user;
      
      users.push(this.userRepository.create({
        ...userData,
        // ? encriptacion de las contrasenas
        password: bcrypt.hashSync(password, 10) 
      }));
    });

    // ? guardamos en la db
    await this.userRepository.save(users);

    // ? retorn el user que se usara para la creacion de cada product del seed
    return users[0];
  }

  // * METODO QUE RECONTRUYE LA DB CON NUEVA DATA
  private async insertNewProducts(user: User) {
    // ? eliminacion de lo que existe
    await this.productService.deleteAllProducts();

    // ? array de seed product(luce como el create dto)
    const products = initialData.products;

    // ? array que usaremos para insertar cada product (promises)
    const inserPromises: any = [];

    // ? barremos cada product, y lo que hacemos es que insertamos cada product
    // ? y luego ejecutamos, son promesas aun no resueltas
    products.forEach((product) => {
      inserPromises.push(this.productService.create(product, user));
    });

    // ? aqui es donde se resuelve cada promesa (create many in db)
    // ? un solo insert en lugar de multiples queries
    await Promise.all(inserPromises);
  }
}
