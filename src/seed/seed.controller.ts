import { Controller, Get } from '@nestjs/common';

import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRolesEnum.admin) // ! solo para desarrollo (no en ambiente de produccion)
  executeSeed() {
    return this.seedService.runSeed();
  }

}
