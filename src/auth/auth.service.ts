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

import { User } from './entities/user.entity';
import { CreateUserDTO, LoginUserDTO } from './dto/index';

@Injectable()
export class AuthService {
  
  // * logger
  private readonly logger: Logger = new Logger('AuthService');
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        roles: user.roles,
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

      // ? si no lo encuentra(malas credenciales)
      if (!user) {
        throw '400'
      }
      
      // ? usamos de bcrypt, el metodo compareSync, que esto nos sirve
      // ? para comparar la password actual con el hash guardado
      // ? esto se logra con unas configuraciones ya guardadas en el hash 
      // ? llamada 'salt', se obtiene esta salt y se replica en la password actual
      // ? y si se llega al mismo hash hay match y devuelve true
      if (!bcrypt.compareSync(password, user.password)) {
        throw '401'
      }

      // ? retornamos
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
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
