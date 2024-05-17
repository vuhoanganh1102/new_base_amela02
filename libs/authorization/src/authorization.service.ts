import {
  CommonStatus,
  ErrorCode,
  Permissions,
} from '../../core/src/constants/enum';
import { Exception } from '@app/core/exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import Permission from './entities/Permission';
import PermissionGroup from './entities/PermissionGroup';
import Role from './entities/Role';
import RolePermission from './entities/RolePermission';
import UserPermission from './entities/UserPermission';
import User from '@app/database-type-orm/entities/User';
import { GlobalCacheService } from '@app/cache';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly cacheService: GlobalCacheService,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  async getListPermissions() {
    return await this.permissionRepository.find();
  }

  async getListRole() {
    return await this.roleRepository.find({
      where: {
        isVisible: CommonStatus.ACTIVE,
      },
    });
  }

  async addRole(name: string) {
    return await this.roleRepository.save({ name });
  }

  async updateRole(roleId: number, name: string) {
    return await this.roleRepository.update(roleId, { name });
  }

  async hiddenRole(roleId: number) {
    return await this.roleRepository.update(roleId, {
      isVisible: CommonStatus.INACTIVE,
    });
  }

  async getPermissionByGroup(permissions: Array<number>) {
    const getListPermissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select([
        'permission.id id',
        'permission.name name',
        'permission.permissionGroupId permissionGroupId',
        'permissionGroup.name groupName',
      ])
      .innerJoin(
        PermissionGroup,
        'permissionGroup',
        'permission.permissionGroupId = permissionGroup.id',
      )
      .getRawMany();
    const listPermissionAdvance = getListPermissions.map((item) => {
      item.hasPermission = permissions.includes(item.id) ? 1 : 0;
      return item;
    });
    return this.convertToObject(listPermissionAdvance, 'groupName');
  }

  async getRolePermissions(roleId: number) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role)
      throw new Exception(ErrorCode.Not_Found, 'Not found role permission');

    const getRolePermissions = await this.rolePermissionRepository.find({
      where: { roleId: roleId },
    });
    const rolePermissions: Array<number> = getRolePermissions.map(
      (item) => item.permissionId,
    );
    return this.getPermissionByGroup(rolePermissions);
  }

  async updateRolePermissions(
    roleId: number,
    permissions: Array<number>,
    changeUserPermission: 0 | 1,
  ) {
    const KEY_CACHE_USER_PERMISSIONS = this.cacheService.createKeyCacheData(
      'KEY_CACHE_USER_PERMISSIONS',
    );

    await this.dataSource.transaction(async (transaction) => {
      const RolePermissionRepository =
        transaction.getRepository(RolePermission);
      const roleRepository = transaction.getRepository(Role);
      const userPermissionRepository =
        transaction.getRepository(UserPermission);
      const userRepository = transaction.getRepository(User);

      const role = await roleRepository.findOne({ where: { id: roleId } });
      if (!role) throw new Exception(ErrorCode.Not_Found);

      await RolePermissionRepository.delete({
        roleId: roleId,
        permissionId: Not(In([...permissions, -1])),
      });
      const dataUpdateRolePermissions = permissions.map((item) => {
        return { roleId, permissionId: item };
      });
      await RolePermissionRepository.save(dataUpdateRolePermissions);

      if (changeUserPermission) {
        const users = await userRepository.find({
          where: { roleId },
          select: ['id', 'roleId'],
        });
        const userIds = users.map((item) => item.id);

        await userPermissionRepository.delete({
          userId: In([...userIds, -1]),
          permissionId: Not(In([...permissions, -1])),
        });

        const dataUserPermission = users.reduce((acc: any, cur: any) => {
          const userPermissions = permissions.map((item) => ({
            userId: cur.id,
            permissionId: item,
          }));
          acc.push(...userPermissions);
          return acc;
        }, []);

        await userPermissionRepository.save(dataUserPermission);
        const keyCache = `${KEY_CACHE_USER_PERMISSIONS}:*`;
        await this.cacheService.del(keyCache);
      }
    });
    return;
  }

  async getUserPermissionsAndGroup(userId: number) {
    const userPermission = await this.userPermissionRepository.find({
      where: { userId: userId },
    });
    const permissions = userPermission.map(
      (permission) => permission.permissionId,
    );
    return this.getPermissionByGroup(permissions);
  }

  async getUserPermissions(
    userId: number,
    userPermissionRepository?: Repository<UserPermission>,
  ) {
    const keyCache = this.cacheService.createKeyCacheData(
      `KEY_CACHE_USER_PERMISSIONS_${userId}`,
    );

    const cacheData: string = (await this.cacheService.get(keyCache)) as any;
    if (cacheData) return JSON.parse(cacheData);

    userPermissionRepository =
      userPermissionRepository ?? this.userPermissionRepository;
    const userPermission = await userPermissionRepository.find({
      where: { userId: userId },
    });
    const permissionIds = userPermission.map((item) => item.permissionId);

    await this.cacheService.set(keyCache, JSON.stringify(permissionIds));
    return permissionIds;
  }

  async updateUserPermissions(userId: number, permissions: Permissions[]) {
    await this.dataSource.transaction(async (transaction) => {
      const KEY_CACHE_USER_PERMISSIONS = this.cacheService.createKeyCacheData(
        'KEY_CACHE_USER_PERMISSIONS',
      );

      const userPermissionRepository =
        transaction.getRepository(UserPermission);

      await userPermissionRepository.delete({
        userId,
        permissionId: Not(In([...permissions, -1])),
      });

      const data = permissions.map((permissionId) => ({
        userId,
        permissionId,
      }));

      await userPermissionRepository.save(data);

      const keyCache = `${KEY_CACHE_USER_PERMISSIONS}:${userId}`;
      await this.cacheService.del(keyCache);
    });
    return;
  }

  async getRolePermissionIds(roleId: number): Promise<number[]> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new Exception(ErrorCode.Not_Found);
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId: roleId },
    });
    const permissions: Array<number> = rolePermissions.map(
      (item) => item.permissionId,
    );
    return permissions;
  }

  convertToObject(
    data: Array<Object>,
    key: string,
  ): { [key: string]: Array<any> } {
    const result = {} as any;
    for (let i = 0; i < data.length; i++) {
      const element = data[i] as any;
      const keyEl = element[key];
      if (!result[keyEl]) {
        result[keyEl] = [];
      }
      delete element[key];
      result[keyEl].push(element);
    }
    return result;
  }
}
