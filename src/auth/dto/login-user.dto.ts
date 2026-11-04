import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// ! DTO QUE MANEJARA LA INFO QUE NOS ENVIE PARA EL LOGIN DEL USER
export class LoginUserDTO {
  // * PROPIEDAD EMAIL, DEBE SER STRING Y EMAIL
  @IsString()
  @IsEmail()
  public email!: string;

  // * PROPIEDAD PASSWORD, DEBE SER STRING, MIN Y MAX
  // * ADEMAS DEBE CUMPLIR CON UNA ESTRUCTURA(EXPRESION REGULAR)
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    // ? expresion regular que se debe de cumplir
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
      message:
        'The password must have a Uppercase, lowercase letter and a number',
    },
  )
  public password!: string;
}
