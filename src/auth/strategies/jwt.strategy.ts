import { Injectable, UnauthorizedException } from "@nestjs/common";

import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

import { User } from "../entities/user.entity";
import { JwtPayloadInterface } from "../interfaces/jwt-payload.interface";

// ! STRATEGY PARA EL JWT, EN ESTE PUNTO YA SABEMOS SI EL JWT ES VERIDICO O NO CON EL PAYLOAD
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService,
    ){
        super({
            // ? obtener la firma del jwt
            secretOrKey: configService.get<string>('JWT_SECRET')!,
            // ? lo recivimos como un bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    // ! EN ESTE PUNTO EL USER YA INGRESO EMAIL Y PASSWORD CORRECTOS

    // ! EL USO DEL ID EN AL PAYLOAD NOS PERMITE CAMBIAR LOS DEMAS CAMPOS COMO EMAIL
    // ! SIN PRODUCIR CONFLICTOS CON EL JWT Y LA OBTENCION DEL PAYLOAD, YA QUE EL ID
    // ! NO CAMBIA
    
    // * METODO QUE VALIDA EL PAYLOAD, ADEMAS ESTE METODO SOLO SE LLAMA 
    // * CUANDO EL JWT NO HA EXPIRADO Y LA FIRMA HACE MATCH CON EL PAYLOAD
    // ? sirve para verificar que la informacion del payload exista en nuestra db
    // ? EL PAYLOAD SE CARGA DEL BEARER TOKEN (UN JWT YA FIRMADO)
    async validate( payload: JwtPayloadInterface ): Promise<User> {
        
        // ? payload data, ojo antiguos jwts, si se maneja con email, 
        // ? puede producir un 500, pq manda una property email y se espera un id
        // ? por ende undefined 
        const {id} = payload;

        // * validacion si no viene le id
        if (!id) throw new UnauthorizedException('Token not valid.')  ;

        // !! OJO ES RECOMENDABLE USAR EL ID, EN LUGAR DE EMAIL(PQ EL EMAIL PUEDE CAMBIAR)

        // ? buscamos el user con esa data
        // ? EN ESTE MOMENTO VIENE YA UN JWT VALIDO, UN ID YA FIRMADO EN EL JWT
        const user = await this.userRepository.findOneBy({id});

        // ! SI EL PAYLOAD/USER DEVUELTOS NO CUMPLEN CON LO REQUERIDO
        // ! EN ESTE PUNTO EL USER PUEDE HACER LOGIN, PERO NO PUEDE
        // ! ACCEDER A LOS ENPOINTS QUE REQUIEREN EL JWT

        // ? si no existe el user es no authorizado
        if (!user) {
            throw new UnauthorizedException('Token not valid.')
        }
        
        // ? si esta inactivo el user, manda no authorizado 
        if (!user.isActive) {
            throw new UnauthorizedException('User is not active, talk with admin.')
        }

        // ? retornamos a la req
        return user;

    }

}
