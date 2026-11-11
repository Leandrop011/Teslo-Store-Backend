import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDTO, LoginUserDTO } from './dto/index';
import { GetUser, RawHeaders, RoleProtected, Auth } from './decorators/index';
import { UserRolGuard } from './guards/user-rol/user-rol.guard';
import { ValidRolesEnum } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // * ENDPOINT REGISTER A NEW USER
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.authService.createUser(createUserDto);
  }

  // * ENDPOINT LOGIN A USER
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.loginUser(loginUserDto);
  }

  // * ENDPOINT DE REVALIDACION DE JWT
  @Get('check-auth-status')
  @UseGuards(AuthGuard())
  checkAuthStatus(
    @GetUser() user: User,
  ){
    return this.authService.checkAuthStatus(user);
  }

  // ! -------------- TEST RUTAS (BORRAR EN AMBIENTE DE PRODUCCION)------------ 

  // * ENDPOINT DE PRUEBA, PRIVATE ROUTE( mas que todo es para authentication esto)
  // ? USAMOS UN GUARD PARA RECIVIR LA SOLICITUD DE ACCESO AL ENDPOINT
  // ? Y USAMOS UN DECORADOR AuthGuard, ESTO YA TRAE CARGADO LA STRATEGY QUE SE REALIZO
  // ? VA A EJECUTAR POR DEFECTO EL VALIDATE, ESE GUARD DETECTA SI ES O NO JWT
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // ? decorador de parametros personalizado para obtener el user
    @GetUser() user: User,
    @GetUser('email') userEmail: string, // ? por email
    @RawHeaders() rawHeaders: string[], // ? raw headers
  ) {
    return {
      user,
      userEmail: userEmail,
      rawHeaders: rawHeaders,
    };
  }

  // ! LOS 2 ENDPOINTS SIGUIENTES SON PARA AUTHENTICATION Y AUTHORIZATION
  // * RUTA QUE ESTARA PRIVADA POR ROLES
  @Get('second-private')
  @UseGuards(AuthGuard(), UserRolGuard)
  @SetMetadata('roles', ['admin', 'super-admin']) // ? agregar metadata(roles) para generar authorization
  testingPrivateRouteSecond(@GetUser() user: User) {
    return user;
  }

  // * RUTA PRIVADA POR ROLES CON DECORADOR PERSONALIZADO PARA LOS ROLES
  @Get('third-private')
  // ? decorador personalizado para manejar los roles que se permiten(estos se mandan al user rol guard)
  @RoleProtected(ValidRolesEnum.superUser)
  @UseGuards(AuthGuard(), UserRolGuard)
  testingPrivateRouteThird(@GetUser() user: User) {
    return user;
  }

  // * RUTA PRIVADA CON UN SOLO DECORADOR COMPUESTO QUE MANEJARA LOS ROLES Y LOS GUARDS
  @Get('fourth-private')
  // ? este decorador auth ya realiza la validacion de que sea un jwt, sea un user de db
  // ? que el user este activo, que los roles establecidos se cumplan, aplica la strategy
  @Auth(ValidRolesEnum.admin) // ? decorador compuesto con un decorador de roles y el guard
  testingPrivateRouteFourth(@GetUser() user: User) {
    return user;
  }
}
