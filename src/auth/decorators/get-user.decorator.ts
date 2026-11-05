import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '../entities/user.entity';

// ! DECORADOR PERSONALIZADO QUE DEVUELVE UN USER EN BASE A
// ! LA REQUEST QUE TIENE ESE ENDPOINT
export const GetUser = createParamDecorator(
  // * data es lo que mandamos en argumentos del decorador @('esto-aqui')
  // * y ctx es el contexto actual en el que se ejcuta el endpoint (tiene la req)
  ( data , ctx: ExecutionContext) => {
    // * ctx es el context en ql eue se ejecuta(tiene la req)
    const req = ctx.switchToHttp().getRequest();
    
    // * devolvemos de la req el user
    const user: User = req.user;

    // * validacion si no se encuentra el user, y es un 500
    // * pq en ese momento el strategy (guard) ya deberia devolver un user
    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    // ? dependiendo de lo que se nos pide en los args/data del decorador
    // ? retornamos cierta info
    if (data) {
      return user[data];
    }

    // * retornamos la info completa
    return user;
  },
);
