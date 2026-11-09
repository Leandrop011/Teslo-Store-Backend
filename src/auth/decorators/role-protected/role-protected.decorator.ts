import { SetMetadata } from '@nestjs/common';
import { ValidRolesEnum } from '../../interfaces/index';

// ! CONST PARA LA REFERENCIA/KEY DE LOS STRINGS/ROLES
export const META_ROLES = 'roles' 

// ! METODO QUE ESTABLECE EN LA METADA LOS ROLES QUE RECIBE COMO ARGUMENTO
export const RoleProtected = (...args: ValidRolesEnum[]) => {
    return SetMetadata(META_ROLES, args);
};
