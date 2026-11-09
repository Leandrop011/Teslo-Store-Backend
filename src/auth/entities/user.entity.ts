import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';

// ! ENTIDAD USERS
@Entity({ name: 'users' })
export class User {
  // * PRIMARY KEY UUID
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  // * COLUMN EMAIL UNIQUE
  @Column('text', {
    nullable: false,
    unique: true,
  })
  public email!: string;

  // * COLUMN PASSWORD
  @Column('text', {
    nullable: false,
    // ? al momento de realizar una consulta de un registro de user
    // ? el value password no se incluira
    select: false 
  })
  public password!: string;

  // * COLUMN FULLNAME
  @Column('text', {
    nullable: false,
  })
  public fullName!: string;

  // * COLUMN ISACTIVE
  @Column('bool', {
    nullable: false,
    default: true,
  })
  public isActive!: boolean;

  // * COLUMN ROLES
  @Column('text', {
    array: true,
    nullable: false,
    default: ['user'],
  })
  public roles!: string[];


  // ! BEFOREINSERT
  @BeforeInsert()
  checkFieldsBeforeInsert(){
    this.email = this.email.toLowerCase().trim();
  }
  
  // ! BEFOREUPDATE
  @BeforeUpdate()
  checkFieldsBeforeUpdate(){
    this.checkFieldsBeforeInsert();
  }

  // ! RELACION CON PRODUCTS (PARA SABER QUIEN CREA O EDITA CADA PRODUCT)
  // ! AQUI NO SE CREA UNA COLUMN PRODUCT(ES LA PADRE)
  @OneToMany(
    () => Product,
    (product) => product.user
  )
  public product?: Product;

}
