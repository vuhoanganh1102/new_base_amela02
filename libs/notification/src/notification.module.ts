import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { OneSignal } from './onesignal';

@Module({
  providers: [NotificationService, OneSignal],
  exports: [NotificationService, OneSignal],
})
export class NotificationModule {}
