
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRolesEnum } from '../interfaces/index';
import { UserRolGuard } from '../guards/user-rol/user-rol.guard';
import { RoleProtected } from './role-protected/role-protected.decorator';

// ! DECORADOR COMPUESTO DE DECORADOR Y GUARDS, RECIVE COMO PARAMETROS ROLES
export function Auth(...roles: ValidRolesEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    // * auth guard valida el jwt (authentication y aplica la strategy)
    UseGuards(AuthGuard(), UserRolGuard),
  );
}
