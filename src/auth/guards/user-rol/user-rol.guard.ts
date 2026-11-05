import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { User } from '../../entities/user.entity';

// ! GUARD QUE VERIFICARA EL ACCESO MEDIANTE ROLES
// ! SI NO TIENE LOS ROLES VALIDO MANDA EXCEPTION
@Injectable()
export class UserRolGuard implements CanActivate {
  constructor(
    // ? reflector nos permite ver la info de otros decoradores
    // ? y metadata del metodo
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // ? obtener los roles validos
    const validRoles: string[] = this.reflector.get('roles', ctx.getHandler());

    // ? validaciones si no vienen los roles
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    // ? obtener el user de la req ( en este punto ya la strategy coloco
    // ? el user en la req (despues de autentica un jwt) )
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;

    // ? validacion si no existe el user
    if (!user) throw new BadRequestException('User not found');

    // ? validar si el user posee algun rol valido, si no exception
    validRoles.map((rol) => {
      if (!user.roles.includes(rol)) {
        throw new UnauthorizedException(
          'Error, no cuentas con el rol para esta accion.',
        );
      }
    });

    return true;
  }
}
