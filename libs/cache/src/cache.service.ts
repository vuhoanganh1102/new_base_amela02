import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, MultiCache, Store } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GlobalCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async reset() {
    await this.cacheManager.reset();
  }

  createKeyCacheData(keyCache: string) {
    const nodeEnv = this.configService.get('nodeEnv');
    return `cache${nodeEnv}:${keyCache}`;
  }

  async set(keyCache: string, data: any, ttl?: number) {
    return await this.cacheManager.set(keyCache, data, { ttl: ttl as any });
  }

  async get(keyCache: string) {
    return await this.cacheManager.get(keyCache);
  }

  async mget(keyCache: string[]) {
    return await (this.cacheManager as any).mget(...keyCache);
  }

  async mset(data: any[]) {
    return await (this.cacheManager as any).mset(...data);
  }

  async del(keyCache: string) {
    return await this.cacheManager.del(keyCache);
  }
}
