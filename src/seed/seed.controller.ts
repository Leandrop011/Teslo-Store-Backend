import { Controller, Get } from '@nestjs/common';

import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators/index';
import { ValidRolesEnum } from '../auth/interfaces';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRolesEnum.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }

}
