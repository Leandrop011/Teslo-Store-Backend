import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

// ! DTO PARA LLEVAR LA DATA POR LA API, USAMOS CLASS VALIDATOR PARA DECORAR
export class CreateProductDto {
  // ! PROPIEDAD TITLE DECORADA
  @IsString()
  @MinLength(1)
  public title!: string;

  // ! PROPIEDAD PRICE DECORADA
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  public price!: number;

  // ! PROPIEDAD SIZES DECORADA
  @IsString({ each: true }) // ? todo lo del array debe ser string
  @IsArray()
  public sizes!: string[];

  // ! PROPIEDAD GENDER DECORADA
  @IsIn(['men', 'women', 'kid', 'unisex']) // ? solo se permite esas opciones de ingreso
  public gender!: string;

  // ! PROPIEDAD DESCRIPTION DECORADA
  @IsString()
  @IsOptional()
  public description?: string;

  // ! PROPIEDAD SLUG DECORADA
  @IsString()
  @IsOptional()
  public slug?: string;

  // ! PROPIEDAD STOCK DECORADA
  @IsInt()
  @IsPositive()
  @IsOptional()
  public stock?: number;

  // ! PROPIEDA DE TAGS
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public tags?: string[];

  // ! PROPIEDAD IMAGES
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  public images?: string[];

}
