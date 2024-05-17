import { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import {
  JwtAuthenticationGuard,
  JwtAuthenticationModule,
} from '@app/jwt-authentication';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import config, {
  IConfig,
  IConfigAuth,
  IConfigSendGrid,
  IConfigTwilio,
  validateConfig,
} from '../config';
import { AuthorizationModule, PermissionsGuard } from 'y/authorization';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '@app/database-type-orm/data-source';
import { GlobalCacheModule } from '@app/cache';
import { LanguageModule } from '@app/language';
import { ResourceModule } from '@app/resource';
import { LibraryConfigModule } from 'libs/config/src';
import { TwilioModule } from '@app/twilio';
import { SendMailModule } from '@app/send-mail';
import { QueueModule } from '@app/queue';
import { AllExceptionsFilter } from '@app/core/filters/http-exception.filter';
import { TransformResponseInterceptor } from '@app/core/interceptors/transform-res.interceptor';
import { Environment } from '@app/core/constants/enum';
import { LoggerMiddleware } from '@app/core/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
      cache: true,
      validate: validateConfig,
    }),
    /* -------------------------------------------------------------------------- */
    /*                                 Rate limit                                 */
    /* -------------------------------------------------------------------------- */
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 300,
    }),
    /* -------------------------------------------------------------------------- */
    /*                          Basic JWT Authentication                          */
    /* -------------------------------------------------------------------------- */
    JwtAuthenticationModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigAuth>('auth'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get('typeORMOptions'),
      }),
      dataSourceFactory: async () => {
        return await dataSource.initialize();
      },
      inject: [ConfigService],
    }),
    AuthorizationModule,
    GlobalCacheModule,
    LibraryConfigModule,
    ResourceModule,
    LanguageModule,
    TwilioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigTwilio>('twilio'),
      }),
      inject: [ConfigService],
    }),
    SendMailModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigSendGrid>('sendGrid'),
      }),
      inject: [ConfigService],
    }),
    QueueModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    AppService,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService<IConfig, true>) {}

  configure(consumer: MiddlewareConsumer) {
    const nodeEnv = this.configService.get<Environment>('nodeEnv');

    if (![Environment.Production].includes(nodeEnv)) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
