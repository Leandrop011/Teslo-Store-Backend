import { Injectable, UnauthorizedException } from "@nestjs/common";

import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

import { User } from "../entities/user.entity";
import { JwtPayloadInterface } from "../interfaces/jwt-payload.interface";

// ! STRATEGY PARA EL JWT
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
    
    // * METODO QUE VALIDA EL PAYLOAD, ADEMAS ESTE METODO SOLO SE LLAMA 
    // * CUANDO EL JWT NO HA EXPIRADO Y LA FIRMA HACE MATCH CON EL PAYLAOD
    // ? sirve para verificar que la informacion del payload exista en nuestra db
    async validate( payload: JwtPayloadInterface ): Promise<User> {
        
        // ? payload data
        const {email} = payload;

        // ? buscamos el user con esa data
        const user = await this.userRepository.findOneBy({ email });

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

        return user;

    }

}
