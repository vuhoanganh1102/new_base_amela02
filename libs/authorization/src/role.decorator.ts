import { RoleId } from '../../core/src/constants/enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * https://docs.nestjs.com/security/authorization#basic-rbac-implementation
 * @param roles
 * @returns
 */
export const Roles = (...roles: RoleId[]) => SetMetadata(ROLES_KEY, roles);
