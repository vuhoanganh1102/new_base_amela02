import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { RequirePermissions } from './permissions.decorator';
import { Permissions } from '../../core/src/constants/enum';
import { validate } from '@app/core/validate';
import {
  addRoleApiBody,
  addRoleSchema,
  exampleResponse,
  hiddenRoleApiBody,
  listPermissionExampleResponse,
  listRoleExampleResponse,
  listRolePermissionExampleResponse,
  updateRolePermissionApiBody,
  updateRoleApiBody,
  updateRolePermissionsSchema,
  updateRoleSchema,
  updateUserPermissionApiBody,
  addRoleExampleResponse,
  listUserPermissionExampleResponse,
} from './authorization.schema';
import {
  AddRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionDto,
} from './dto/role.dto';
import { UpdateUserPermissions } from './dto/user.permisson.dto';
import { AdminGuard } from '@app/core/guards/admin.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ToIntPipe } from '@app/core/pipes/validation.pipe';
@ApiTags('Authorization')
@Controller('cms/authorization')
@UseGuards(AdminGuard)
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  @Get('/permission')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiResponse(listPermissionExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getListPermissions() {
    const permissions = await this.authorizationService.getListPermissions();
    return permissions;
  }

  @Get('/role')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiResponse(listRoleExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getListRoles() {
    const roles = await this.authorizationService.getListRole();
    return roles;
  }

  @Post('/role')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiBody(addRoleApiBody)
  @ApiResponse(addRoleExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async addRole(@Body() body: AddRoleDto) {
    validate(addRoleSchema, body);
    return await this.authorizationService.addRole(body.name);
  }

  @Get('/role-permission/:roleId')
  @ApiResponse(listRolePermissionExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  async getRolePermissions(@Param('roleId', ToIntPipe) roleId: number) {
    const permissions = await this.authorizationService.getRolePermissions(
      roleId,
    );
    return permissions;
  }

  @Put('/role-permission/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiBody(updateRolePermissionApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async updateRolePermissions(
    @Body() body: UpdateRolePermissionDto,
    @Param('roleId', ToIntPipe) roleId: number,
  ) {
    const { permissions, changeUserPermission } = body;
    validate(updateRolePermissionsSchema, body);
    await this.authorizationService.updateRolePermissions(
      roleId,
      permissions,
      changeUserPermission,
    );
    return;
  }

  @Get('/user/:userId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiResponse(listUserPermissionExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getUserPermissions(@Param('userId', ToIntPipe) userId: number) {
    const permissions =
      await this.authorizationService.getUserPermissionsAndGroup(userId);
    return permissions;
  }

  @Put('/user/:userId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiBody(updateUserPermissionApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async updateUserPermissions(
    @Body() body: UpdateUserPermissions,
    @Param('userId', ToIntPipe) userId: number,
  ) {
    await this.authorizationService.updateUserPermissions(
      userId,
      body.permissions,
    );
    return;
  }

  @Put('/role/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiBody(updateRoleApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async updateRole(
    @Body() body: UpdateRoleDto,
    @Param('roleId', ToIntPipe) roleId: number,
  ) {
    validate(updateRoleSchema, body);
    return await this.authorizationService.updateRole(roleId, body.name);
  }

  @Put('/hidden-role/:roleId')
  @RequirePermissions(Permissions.PERMISSION_MANAGEMENT)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async hiddenRole(@Param('roleId', ToIntPipe) roleId: number) {
    return await this.authorizationService.hiddenRole(roleId);
  }
}
