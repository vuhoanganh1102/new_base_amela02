import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueName, QueueProcessor } from '@app/core/constants/enum';
import { OneSignal } from '@app/notification/onesignal';

@Processor(QueueProcessor.PUSH_NOTIFICATION)
export class PushNotificationQueue {
  private readonly logger = new Logger(PushNotificationQueue.name);

  constructor(private readonly pushNotificationService: OneSignal) {}

  @Process(QueueName.ADMIN_PUSH_NOTIFICATION_ALL_MEMBERS)
  async handlePushNotificationAllMemberQueue(job: Job<any>) {
    this.logger.log('push-notification-to-all-member - handle : ', job.data);
    const { content, payload } = job.data;

    await this.pushNotificationService.adminPushNotificationToAllMember(
      content,
      payload,
    );
  }

  @Process(QueueName.PUSH_NOTIFICATION_WITH_PLAYER_ID)
  async handlePushNotificationWithPlayerIdQueue(job: Job<any>) {
    this.logger.log('push-notification-with-player-id - handle : ', job.data);
    const { playerIds, title, content, data } = job.data;

    await this.pushNotificationService.sendNotificationWithPlayerIds(
      playerIds,
      title,
      content,
      data,
    );
  }

  @Process(QueueName.PUSH_NOTIFICATION)
  async handlePushNotificationQueue(job: Job<any>) {
    this.logger.log('push-notification - handle : ', job.data);
    const { memberIds, title, content, data, playerIds } = job.data;

    await this.pushNotificationService.pushNotification(
      memberIds,
      title,
      content,
      data,
      playerIds,
    );
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`Queue - Complete: ${job.id}\n`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    this.logger.log(
      `Queue - failed: ${job.id}.\n Reason: ${job.failedReason}\n`,
    );
  }
}
