import { CommonStatus, RoleId } from '../../../core/src/constants/enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
    select: false,
    nullable: true,
  })
  password: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({
    name: 'status',
    type: 'tinyint',
    default: CommonStatus.ACTIVE,
    unsigned: true,
  })
  status: number;

  @Column({
    name: 'is_super_admin',
    type: 'tinyint',
    default: CommonStatus.INACTIVE,
  })
  isSuperAdmin?: number;

  @Column({
    name: 'role_id',
    type: 'tinyint',
    unsigned: true,
    enum: RoleId,
    default: RoleId.USER,
  })
  roleId: number;

  @Column({ name: 'none_token', type: 'varchar', length: 100, nullable: true })
  noneToken: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    select: false,
    nullable: true,
  })
  refreshToken: string;

  @Column({
    name: 'invited_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  invitedBy: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
