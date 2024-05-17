import { Environment } from '@app/core/constants/enum';
import { substrContent } from '@app/helpers/utils';
import { first } from 'lodash';
import { Client } from 'onesignal-node';
import { CreateNotificationBody } from 'onesignal-node/lib/types';
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import Notification from './entities/Notification';
import { IConfig, IConfigOneSignal } from 'apps/hades-base-nestjs/src/config';

@Injectable()
export class OneSignal {
  client: any;
  memberTag: string;
  isReceivedNotificationTag: string;

  constructor(
    private readonly configService: ConfigService<IConfig, true>,
    private readonly dataSource: DataSource,
  ) {
    this.client = new Client(
      configService.get<IConfigOneSignal>('oneSignal').appId,
      configService.get<IConfigOneSignal>('oneSignal').restKey,
    );

    this.memberTag =
      configService.get('nodeEnv') !== Environment.Production
        ? `${configService.get('nodeEnv')}_memberId`
        : 'memberId';

    this.isReceivedNotificationTag =
      configService.get('nodeEnv') !== Environment.Production
        ? `${configService.get('nodeEnv')}_isReceivedNotification`
        : 'isReceivedNotification';
  }

  chunkArray(memberIds: number[], chunkSize: number) {
    let index = 0;
    const arrayLength = memberIds.length;
    const tempArray = [];

    for (index = 0; index < arrayLength; index += chunkSize) {
      const myChunk = memberIds.slice(index, index + chunkSize);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }
    return tempArray;
  }

  removeBlank(str: string) {
    return str.split(' ').join('');
  }

  async sendNotificationWithPlayerIds(
    playerIds: string[],
    title: any,
    content: any,
    data: any,
  ) {
    const notification: CreateNotificationBody = {
      headings: {
        en: title,
        ja: title,
        vi: title,
      },
      contents: {
        en: content,
        ja: content,
        vi: content,
      },
      data,
      android_group: `${this.removeBlank(
        this.configService.get('appName'),
      )}_notification`,
      adm_group: `${this.removeBlank(
        this.configService.get('appName'),
      )}_notification`,
      thread_id: `${this.removeBlank(
        this.configService.get('appName'),
      )}_notification`,
      include_player_ids: playerIds,
    };
    await this.client.createNotification(notification);
  }

  async adminPushNotificationToAllMember(content: string, data: any) {
    const notification: CreateNotificationBody = {
      headings: {
        en: this.removeBlank(this.configService.get('appName')),
        ja: this.removeBlank(this.configService.get('appName')),
        vi: this.removeBlank(this.configService.get('appName')),
      },
      contents: {
        en: content,
        ja: content,
        vi: content,
      },
      data,
      android_group: `${this.configService.get('appName')}_notification`,
      adm_group: `${this.configService.get('appName')}_notification`,
      thread_id: `${this.configService.get('appName')}_notification`,
      filters: [
        {
          field: 'tag',
          key: this.memberTag,
          relation: 'exists',
        },
        {
          field: 'tag',
          key: this.isReceivedNotificationTag,
          relation: '=',
          value: 'true',
        },
      ],
    };

    await this.client.createNotification(notification);
  }

  async pushNotification(
    memberIds: number[],
    title: string,
    content: string,
    data: any,
    playerIds?: string[],
  ) {
    const notificationRepository = this.dataSource.getRepository(Notification);

    content = substrContent(content, 100);
    title = substrContent(title, 100);

    if (playerIds && playerIds.length && first(playerIds)) {
      // send by player id
      await this.sendNotificationWithPlayerIds(playerIds, title, content, data);
      return;
    }
    if (!memberIds.length) return;

    const memberIdChunk = this.chunkArray(memberIds, 100);

    for (const memberIdsItem of memberIdChunk) {
      const filters: any = [];
      memberIdsItem.forEach((x) => {
        if (filters.length > 0) {
          filters.push({
            operator: 'OR',
          });
          filters.push({
            field: 'tag',
            key: this.memberTag,
            relation: '=',
            value: x,
          });
        } else {
          filters.push({
            field: 'tag',
            key: this.memberTag,
            relation: '=',
            value: x,
          });
        }
      });
      let uuid = uuidv4();

      const notification: CreateNotificationBody = {
        headings: {
          en: title,
          ja: title,
          vi: title,
        },
        contents: {
          en: content,
          ja: content,
          vi: content,
        },
        data,
        android_group: `${data.type}_${data.redirectType}_${
          data.redirectId
        }${this.removeBlank(this.configService.get('appName'))}_notification`,
        adm_group: `${data.type}_${data.redirectType}_${
          data.redirectId
        }${this.removeBlank(this.configService.get('appName'))}_notification`,
        thread_id: `${data.type}_${data.redirectType}_${
          data.redirectId
        }${this.removeBlank(this.configService.get('appName'))}_notification`,
        filters,
        collapse_id: uuid,
      };

      const notificationOnesignal =
        await this.client.createNotification(notification);

      if (notificationOnesignal.statusCode === 200) {
        await notificationRepository.update(
          { id: data.notificationId },
          { uuid: Number(uuid) },
        );
      }
    }
  }
}
