import { Permissions, ResourceType } from '@app/core/constants/enum';
import { AdminGuard } from '@app/core/guards/admin.guard';
import { ToIntPipe } from '@app/core/pipes/validation.pipe';
import { validate } from '@app/core/validate';
import { handleInputPaging } from '@app/helpers/utils';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'libs/jwt-authentication/src/jwt-authentication.decorator';
import { RequirePermissions } from 'y/authorization';

import {
  addResourceSchema,
  updateResourceSchema,
  updateStatusResourceSchema,
  createResourceSingleSchema,
  exampleResponse,
  getResourceInfoExampleResponse,
  getListResourceExampleResponse,
  getDetailResourceExampleResponse,
  getResourceByTypeExampleResponse,
  createResourceApiBody,
  updateResourceApiBody,
  createResourceSingleApiBody,
  updateStatusResourceApiBody,
} from './resource.schema';
import { ResourceService } from './resource.service';

@ApiTags('Resource')
@Controller('cms/resource')
@UseGuards(AdminGuard)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('/init')
  @Public()
  @ApiResponse(getResourceInfoExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  @Public()
  async getResourceInfo() {
    return await this.resourceService.getResourceInfo();
  }

  @Get('/')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  @Public()
  @ApiResponse(getListResourceExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getLisResource(@Query() query: any) {
    handleInputPaging(query);
    return await this.resourceService.getListResource(query);
  }

  @Post('/create-resource')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  @ApiBody(createResourceApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async createResource(
    @Body() body: any,
    @Query('userId', ToIntPipe) userId: number,
  ) {
    validate(addResourceSchema, body);
    await this.resourceService.createResource(userId, body);
    return;
  }

  @Get('/:resourceId')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  @ApiResponse(getDetailResourceExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getDetailResource(@Param('resourceId', ToIntPipe) resourceId: number) {
    return await this.resourceService.getDetailResource(resourceId);
  }

  @Put('/:resourceId')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  @ApiBody(updateResourceApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async updateResource(
    @Body() body: any,
    @Param('resourceId', ToIntPipe) resourceId: number,
  ) {
    validate(updateResourceSchema, body);
    await this.resourceService.updateResource(resourceId, body);
    return;
  }

  @Put('/update-status/:resourceId')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  @ApiBody(updateStatusResourceApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async updateStatusResource(
    @Body() body: any,
    @Param('resourceId', ToIntPipe) resourceId: number,
  ) {
    validate(updateStatusResourceSchema, body);
    await this.resourceService.updateStatusResource(resourceId, body);
    return;
  }

  @Post('/create-resource-single')
  @RequirePermissions(Permissions.RESOURCE_MANAGEMENT)
  @ApiBody(createResourceSingleApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async createResourceSingle(@Body() body: any) {
    validate(createResourceSingleSchema, body);
    await this.resourceService.createResourceSingle(body);
    return;
  }

  @Public()
  @Get('/resource-by-type/:type')
  @ApiResponse(getResourceByTypeExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getResourceByType(@Param('type', ToIntPipe) type: number) {
    return await this.resourceService.getResourceByType(type);
  }
}
