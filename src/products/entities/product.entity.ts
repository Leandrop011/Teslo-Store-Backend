import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./index";
import { User } from "../../auth/entities/user.entity";

// ! ESTO ES LA REPRESENTACION DE UNA ENTIDAD/TABLA EN LA DB
// ? (USAMOS LOS DECORADORES DE TYPEORM PARA CREAR COLUMNAS Y DARLSE CONSTRINTS EN LA DB) 
@Entity({ name: 'products' })
export class Product {
    
    // ! COLUMN ID (PRIMARY KEY)
    // ? usamos typeorm para que esto sea una columna y 
    // ? siempre sean uuid, y como es primary es no nulo
    @PrimaryGeneratedColumn('uuid') 
    public id!: string;
    
    // ! COLUMN TITLE (UNIQUE AND NOT NULL)
    // ? nueva column, de tipo text
    @Column('text', {
        unique: true, // * debe ser unique
        nullable: false // * debe se no nulo
    })
    public title!: string
    
    // ! COLUMN DESCRIPTION (NULL)
    @Column({
        type: 'text',
        nullable: true // * puede ser nulo
    })
    public description?: string;
    
    // ! COLUMN GENDER
    @Column(
        'text',{
            nullable: false
        }
    )
    public gender!: string
    
    // ! COLUMN SLUG (UNIQUE)
    @Column('text', {
        unique: true,
        nullable: false,
    })
    public slug!: string;
    
    // ! COLUMN SIZES (ARRAY)
    @Column('text', {
        array: true, // * un arreglo
        nullable: false,
        default: []
    })
    public sizes!: string[]
    
    // ! COLUMN price (NOT NULL, default value=0)
    @Column('float', {
        nullable: false,
        default: 0 // * valor por fedecto de 0
    })
    public price!: number;

    // ! COLUMN STOCK (DEFAULT=0)
    @Column('float', {
        default: 0,
        nullable: false,
    })
    public stock!: number;

    // ! COLUMN TAGS
    @Column('text', {
        array: true,
        nullable: false,
        default: []
    })
    public tags!: string[]

    // ! RELACION IMAGES
    // ? relacion one to many images
    @OneToMany(
        // * forma de hacer relaciones entre tablas
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    ) 
    public images?: ProductImage[]

    // ! RELACION USERS MANY TO ONE(AQUI SE CREA LA RELACION A user)
    @ManyToOne(
        () => User,
        ( user ) => user.product,
        {eager: true} // ? mostrar las relaciones que se tiene
    )
    user!: User

    // ! -----------------------------

    // ! SE EJECUTA ANTES DE QUE SE CREA UN PRODUCTO
    // * ESTE METODO SE EJECUTARA AL MOMENTO ANTES 
    // * DE INSERCIONES, CUANDO SE CREE LA INSTANCIA
    // * SI SE DETECTA QUE NO HAY SLUG, SE LE ASIGNA EL TITLE
    @BeforeInsert()
    checkSlugInsert(){
        if (!this.slug) {
            this.slug = this.title
        }
        
        this.slug = this.slug.toLowerCase().
        replaceAll(' ', '_').
        replaceAll("'", '')
    }
    
    // ! SE EJECUTA ANTES DE QUE SE ACTUALIZE UN PRODUCTO (SIEMPRE)
    @BeforeUpdate()
    checkSlugUpdate(){
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug.toLowerCase().
        replaceAll(' ', '_').
        replaceAll("'", '');
    }

}
