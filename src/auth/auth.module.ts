import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),

    // ? configuracion para usar jwt
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    ConfigModule,

    // ? registro de las configuracion y firma de un jwt
    // ? usamos registerAsync por si no se cargaron sincronicamente 
    // ? las env 
    JwtModule.registerAsync({
      // ? para el uso de las env usamos el configservice
      imports: [ ConfigModule ],
      inject: [ ConfigService ], 
      // ? configuraciones del jwt
      useFactory: ( configService: ConfigService ) => { 
        return  {
          // ? firma secreta para el registro de un jwt
          secret: configService.get('JWT_SECRET'),
          signOptions: { 
            // ? expiracion del token
            expiresIn: configService.get('JWT_EXPIRES_IN') ?? '2h',
          }
        }
      }
    }),

  ],
  // ? modulos y providers que se usara externamente
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
  ]
})
export class AuthModule {}
