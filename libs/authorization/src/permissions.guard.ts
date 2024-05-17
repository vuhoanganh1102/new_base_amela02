import { Permissions, UserType } from '../../../libs/core/src/constants/enum';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { IS_PUBLIC_KEY } from 'libs/jwt-authentication/src/jwt-authentication.decorator';
import { Forbidden } from '../../core/src/exception';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const permissions = this.reflector.getAllAndOverride<Permissions[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!permissions) return true;

    const request = context?.switchToHttp()?.getRequest();

    const user = (request as any).payload;

    if (user.userType === UserType.SUPER_ADMIN) return true;

    // TODO Check user permission
    const userPermissions = await this.authorizationService.getUserPermissions(
      user.id,
    );

    if (
      !userPermissions.some((permission: Permissions) =>
        permissions.includes(permission),
      )
    ) {
      throw new Forbidden("You don't have permission to access this API!");
    }
    return true;
  }
}
