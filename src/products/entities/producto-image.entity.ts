import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";

// ? el name es el nombre que tomara la tabla/entidad
@Entity({ name: 'product_images' })
export class ProductImage{

    // ! COLUMN ID ( PRIMARY KEY )
    @PrimaryGeneratedColumn()
    public id!: number;

    // ! COLUMN URL
    @Column(
        'text',{
            nullable: false
        }
    )
    public url!: string;

    // ! RELACION CON PRODUCT( IDPRODUCT )
    // ? RELACION MANY TO ONE PRODUCT
    @ManyToOne(
        // * ambas tablas deben tener referencia en los 2 archivos
        () => Product,
        (product) => product.images,
        // ? eliminacion en cascada si se intenta eliminar la tabla padre
        {onDelete: "CASCADE"} 
    )
    public product!: Product

}
