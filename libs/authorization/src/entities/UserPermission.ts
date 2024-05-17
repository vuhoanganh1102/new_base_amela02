import { Entity, PrimaryColumn } from "typeorm";
import { Permissions } from "../../../core/src/constants/enum";

@Entity('user_permission')
export default class UserPermission {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @PrimaryColumn({ name: 'permission_id', type: 'int' })
  permissionId: Permissions;
}
