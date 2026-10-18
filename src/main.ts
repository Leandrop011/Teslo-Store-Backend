import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// ! SECTION CONNECTION TO DB AND CREATE A COMPLETE CRUD

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
