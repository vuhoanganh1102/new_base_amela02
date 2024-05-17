import { CacheModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { GlobalCacheService } from './cache.service';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig } from 'apps/hades-base-nestjs/src/config';
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IConfig, true>) => {
        return {
          // redis config
          // store: redisStore,
          // host: '127.0.0.1',
          // port: '6379',
          // db: '0',
          // password: '',
          // ttl: 30,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [GlobalCacheService],
  providers: [GlobalCacheService],
})
export class GlobalCacheModule {}
