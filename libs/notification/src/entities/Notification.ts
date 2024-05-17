import {
  CommonStatus,
  NotificationTargetType,
} from '../../../core/src/constants/enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification')
export default class Notification {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'status', type: 'tinyint', default: CommonStatus.ACTIVE })
  status: number;

  @Column({ name: 'type', type: 'tinyint', nullable: true })
  type?: number;

  @Column({ name: 'title', type: 'varchar', length: '500', nullable: true })
  title?: string;

  @Column({ name: 'url', type: 'varchar', length: 500, nullable: true })
  url?: string;

  @Column({
    name: 'redirect_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  redirect_id: number;

  @Column({ name: 'redirect_type', type: 'tinyint', nullable: true })
  redirectType?: number;

  @Column({ name: 'target_type', type: 'tinyint', default: 1 })
  targetType: NotificationTargetType;

  @Column({ name: 'uuid', type: 'uuid', nullable: true })
  uuid: number;

  @Column({ name: 'image', type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({
    name: 'created_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  createBy: number;

  @Column({
    name: 'deleted_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  deletedBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: string;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
    unsigned: true,
  })
  updatedBy?: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: string;
}
