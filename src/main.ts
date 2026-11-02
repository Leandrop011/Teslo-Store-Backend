import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// ! SECTION FILES( MANAGMENT FILES IN THE BACKEND )

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes( // ? configuracion global pipes
    new ValidationPipe({
      whitelist: true, // * remueve lo inecesario 
      forbidNonWhitelisted: true, // * retorna bad request si no estan todas las propiedades requeridas
    }),
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
