import { Forbidden } from '../../core/src/exception';
import { RoleId } from '../../core/src/constants/enum';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'libs/jwt-authentication/src/jwt-authentication.decorator';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<RoleId[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    // TODO Check user role
    const hasPrivilege = user?.roles?.some((role: RoleId) =>
      roles.includes(role),
    );

    if (!hasPrivilege) {
      throw new Forbidden('You do not have privileges to access this API!');
    }

    return true;
  }
}
