import { GlobalCacheModule } from '@app/cache';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryConfigModule } from 'libs/config/src';
import Resource from './entities/Resource';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    ConfigModule,
    LibraryConfigModule,
    GlobalCacheModule,
  ],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
