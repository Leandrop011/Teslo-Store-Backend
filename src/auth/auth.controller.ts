import { Controller, Post, Body, Get, UseGuards, SetMetadata } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDTO, LoginUserDTO } from './dto/index';
import { GetUser, RawHeaders } from './decorators/index';
import { UserRolGuard } from './guards/user-rol/user-rol.guard';

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

  // * ENDPOINT DE PRUEBA, PRIVATE ROUTE
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

  // * RUTA QUE ESTARA PRIVADA POR ROLES
  @Get('second-private')
  @UseGuards(AuthGuard(), UserRolGuard)
  @SetMetadata('roles', ['admin']) // ? agregar metadata(roles) para generar authorization
  testingPrivateRouteSecond(
    @GetUser() user: User,
  ){
    return user;
  }
  
}
