import {
  CommonStatus,
  ReadNotification,
} from '../../../core/src/constants/enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification_member')
export default class NotificationMember {
  @PrimaryColumn({
    name: 'notification_id',
    type: 'bigint',
    unsigned: true,
    nullable: false,
  })
  notificationId: number;

  @PrimaryColumn({
    name: 'member_id',
    type: 'bigint',
    unsigned: true,
    nullable: false,
  })
  memberId: number;

  @Column({
    name: 'is_read',
    type: 'tinyint',
    default: ReadNotification.UNREAD,
  })
  isRead: ReadNotification;

  @Column({
    name: 'status',
    type: 'tinyint',
    default: CommonStatus.ACTIVE,
  })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: string;
}
