import { QueueName } from '@app/core/constants/enum';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import Bull, { Queue } from 'bull';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QueueName.SEND_MAIL)
    private readonly sendMailQueue: Queue,
    @InjectQueue(QueueName.PUSH_NOTIFICATION)
    private readonly pushNotificationQueue: Queue,
  ) {}

  /**
   * example data
   *   await this.queueService.addAdminPushNotificationToAllMember(
   *   QueueName.ADMIN_PUSH_NOTIFICATION_ALL_MEMBERS,
   *   { content: '1', payload: { name: '2' } },
   * );
   */

  async addSendMailQueue(name: QueueName, data: any, opts?: Bull.JobOptions) {
    await this.sendMailQueue.add(name, data, {
      ...opts,
    });
  }

  /**
   * example data
   * await this.queueService.addSendMailQueue(QueueName.SEND_MAIL, {
   *   receiver: 'lucifer199xpt@gmail.com',
   *   subject: 'string',
   *   content: 'content',
   *   html: 'html',
   * });
   */

  async addAdminPushNotificationToAllMember(
    name: QueueName,
    data: any,
    opts?: Bull.JobOptions,
  ) {
    await this.pushNotificationQueue.add(name, data, {
      ...opts,
    });
  }
  /**
   *await this.queueService.addSendNotificationWithPlayerIds(
   * QueueName.PUSH_NOTIFICATION_WITH_PLAYER_ID,
   *   {
   *    playerIds: ['3d54cef0-0b47-4bb3-b2bf-a4f7c1b03e10'],
   *   title: 'title',
   *    content: 'content',
   *    data: { name: 'data' },
   *  },
   *);
   */

  async addSendNotificationWithPlayerIds(
    name: QueueName,
    data: any,
    opts?: Bull.JobOptions,
  ) {
    await this.pushNotificationQueue.add(name, data, {
      ...opts,
    });
  }
  /**
   *  await this.queueService.addPushNotification(QueueName.PUSH_NOTIFICATION, {
   *   memberIds: number[],
   *   title: 'string',
   *   content: 'string',
   *  data: { name: 'data' },
   *  playerIds: ['3d54cef0-0b47-4bb3-b2bf-a4f7c1b03e10'],
   * });
   */

  async addPushNotification(
    name: QueueName,
    data: any,
    opts?: Bull.JobOptions,
  ) {
    await this.pushNotificationQueue.add(name, data, {
      ...opts,
    });
  }
}
