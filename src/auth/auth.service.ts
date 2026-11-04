import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDTO, LoginUserDTO } from './dto/index';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
  // * logger objetc
  private readonly logger: Logger = new Logger('AuthService');
  
  constructor(
    // ? repo de user
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // ? service ya creado e importado en el jwtmodule
    private readonly jwtService: JwtService,
  ) {}
  
  // * METODO QUE CREARA UN NUEVO USER
  async createUser(createUserDto: CreateUserDTO) {
    try {
      // ? desestructuramos el content dto
      const {password, ...userData} = createUserDto;
      
      // ? creamos una instancia/registro para guardar en la db
      const user = this.userRepository.create({
        // ? data
        ...userData,
        // ? password encriptada, usamos el paquete 'bcrypt'
        // ? para encriptarla en un hash( un codigo encriptado irrecuperable )
        password: bcrypt.hashSync( password, 10 ),
      });
      
      // ? guardamos en la db ese user
      await this.userRepository.save(user);
      
      // ? retornamos
      // * cada jwt se relaciona con el payload(email)
      // * asi que ahi hay relacion con el user y el jwt
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        roles: user.roles,
        token: this.getJwToken({email: user.email}) // ? jwt
      };
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }
  
  // * METODO QUE REALIZARA LA VERIFICACION Y EL LOGIN DE UN USER
  async loginUser(loginUserDto: LoginUserDTO) {
    try {
      // ? desestructuramos lo que nos da el user
      const {password, email} = loginUserDto;
      
      // ? buscamos el user en la db segun el email y solo retornamos email y password 
      const user = await this.userRepository.findOne({
        where: {email}, // ? solo el registro que haga match con este email
        select: {email: true, password: true}
      });

      // ? si no lo encuentra(malas credenciales o not founded)
      if (!user) {
        throw '400'
      }
      
      // ? usamos de bcrypt, el metodo compareSync, que esto nos sirve
      // ? para comparar la password actual con el hash guardado
      // ? esto se logra con unas configuraciones ya guardadas en el hash 
      // ? llamada 'salt', se obtiene esta salt y se replica en la password actual
      // ? y si se llega al mismo hash hay match y devuelve true
      // * seria necesario saber la password correcta para hacer match
      if (!bcrypt.compareSync(password, user.password)) {
        throw '401'
      }

      // ? retornamos
      return {
        ...user, 
        token: this.getJwToken({email: user.email})
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // * METODO PARA GENERAR UN JWT
  private getJwToken( payload: JwtPayloadInterface ){
    // ? generar el jwt en base al paylaod
    const token = this.jwtService.sign( payload );
    return token;
  }

  // * METODO QUE MANEJARA SEGUN UN CODIGO DE ERROR, EJECUTARA UNA EXCEPTION
  private handleDBExceptions(error: any): never {
    
    if (error === '404' || error === '400') {
      throw new NotFoundException('Error, user not founded');
    }

    if (error === '401') {
      throw new UnauthorizedException('Error, credenciales incorrectas.');
    }
    
    if (error === '23505') {
      throw new BadRequestException(`Error: ${error}`);
    }
    
    this.logger.log(`Error: ${error}`);
    
    throw new InternalServerErrorException('Error, check server logs');
  }
}
