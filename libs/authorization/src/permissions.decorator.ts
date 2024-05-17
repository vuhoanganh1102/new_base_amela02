import { Permissions } from "../../core/src/constants/enum";
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
/**
 * https://docs.nestjs.com/security/authorization#claims-based-authorization
 * @param permissions
 * @returns
 * @example
 * @Post()
 * @RequirePermissions(Permission.DIV_LEAD)
 *    create(@Body() body: string) {
 * }
 */
export const RequirePermissions = (...permissions: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
