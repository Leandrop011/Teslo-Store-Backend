import { Controller, Post, Body, } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './dto/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser( @Body() loginUserDto: LoginUserDTO){
    return this.authService.loginUser( loginUserDto );
  }

}
