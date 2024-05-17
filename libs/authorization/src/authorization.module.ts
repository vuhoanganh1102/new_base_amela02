import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserPermission from './entities/UserPermission';
import Role from './entities/Role';
import Permission from './entities/Permission';
import RolePermission from './entities/RolePermission';
import { GlobalCacheModule } from '@app/cache';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Permission,
      UserPermission,
      RolePermission,
    ]),
    GlobalCacheModule,
  ],
  providers: [AuthorizationService],
  controllers: [AuthorizationController],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
