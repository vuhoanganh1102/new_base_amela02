import { QueueName, QueueProcessor } from '@app/core/constants/enum';
import { NotificationModule } from '@app/notification';
import { SendMailModule } from '@app/send-mail';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  IConfig,
  IConfigQueue,
  IConfigSendGrid,
} from 'apps/hades-base-nestjs/src/config';
import { PushNotificationQueue } from './push-notification.processor';
import { QueueService } from './queue.service';
import { SendMailQueue } from './send-mail.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IConfig, true>) => ({
        redis: {
          host: configService.get<IConfigQueue>('queue').host,
          port: configService.get<IConfigQueue>('queue').port,
        },
        prefix: configService.get<IConfigQueue>('queue').prefix,
        defaultJobOptions: {
          removeOnFail: true,
          removeOnComplete: true,
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: QueueProcessor.PUSH_NOTIFICATION,
      },
      {
        name: QueueProcessor.SEND_MAIL,
      },
    ),
    SendMailModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigSendGrid>('sendGrid'),
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
  ],
  providers: [QueueService, SendMailQueue, PushNotificationQueue],
  exports: [QueueService, SendMailQueue, PushNotificationQueue],
})
export class QueueModule {}
