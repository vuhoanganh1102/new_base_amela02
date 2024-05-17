import { GlobalCacheService } from '@app/cache';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'libs/jwt-authentication/src/jwt-authentication.decorator';
import { AppService } from './app.service';

@ApiTags('App-Controller')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: GlobalCacheService,
  ) {}

  @Get('Hello')
  @Public()
  async getHello() {
    return this.appService.getHello();
  }
}
