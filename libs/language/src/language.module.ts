import { GlobalCacheModule, GlobalCacheService } from '@app/cache';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryConfigModule } from 'libs/config/src';
import Language from './entities/Language';
import LanguageEnv from './entities/LanguageEnv';
import LanguageKey from './entities/LanguageKey';
import LanguageTranslation from './entities/LanguageTranslation';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Language,
      LanguageEnv,
      LanguageKey,
      LanguageTranslation,
    ]),
    ConfigModule,
    LibraryConfigModule,
    GlobalCacheModule,
  ],
  providers: [LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
