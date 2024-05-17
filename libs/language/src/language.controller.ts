import { Permissions } from '@app/core/constants/enum';
import { AdminGuard } from '@app/core/guards/admin.guard';
import { handleInputPaging } from '@app/helpers/utils';
import {
  Body,
  Controller,
  Get,
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
  addLanguageApiBody,
  addLanguageKeyApiBody,
  exampleResponse,
  getFileLanguageExampleResponse,
  getLanguageInfoExampleResponse,
  getListLanguageResponse,
  listEnvironmentsExampleResponse,
  listLanguageKeyResponse,
  updateFileLanguageApiBody,
  updateLanguageApiBody,
  updateLanguageKeyApiBody,
} from './language.schema';
import { LanguageService } from './language.service';

@ApiTags('Language')
@Controller('cms/language')
@UseGuards(AdminGuard)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}
  @Get('/init')
  @Public()
  @ApiResponse(getLanguageInfoExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getLanguageInfo(@Query() query: any) {
    query.environment = query.environment || 'APP';
    const response = await this.languageService.getFileLanguage(query);
    return response;
  }

  @Post('/list')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  @ApiResponse(getListLanguageResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getListLanguage(@Body() body: any) {
    const response = await this.languageService.getListLanguage(body);
    return response;
  }

  @Post('/add-language')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  @ApiBody(addLanguageApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async addLanguage(@Body() body: any) {
    const response = await this.languageService.addLanguage(body);
    return response;
  }

  @Put('/update-language')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  @ApiBody(updateLanguageApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async updateLanguage(@Body() body: any) {
    const response = await this.languageService.updateLanguage(body);
    return response;
  }

  @Post('/list-language-key')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  @ApiResponse(listLanguageKeyResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getListLanguageKey(@Body() body: any) {
    handleInputPaging(body);
    const result = await this.languageService.getListLanguageKey(body);
    return result;
  }

  @Put('/add-language-key')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  @ApiBody(addLanguageKeyApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async addLanguageKey(@Body() body: any) {
    const result = await this.languageService.addLanguageKey(body);
    return result;
  }

  @Put('/update-language-key')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  @ApiBody(updateLanguageKeyApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async updateLanguageKey(@Body() body: any) {
    const result = await this.languageService.updateLanguageKey(body);
    return result;
  }

  /**
   * Do not required permission in this API
   * @param req
   */
  @Public()
  @Post('/get-file-language')
  @ApiResponse(getFileLanguageExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async getFileLanguage(@Body() body: any) {
    body.environment = body.environment || 'APP';
    const result = await this.languageService.downloadFileLanguage(body);
    return result;
  }

  @Post('/upload-file-language')
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  @ApiBody(updateFileLanguageApiBody)
  @ApiResponse(exampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  async uploadFileLanguage(@Body() body: any) {
    const result = await this.languageService.uploadLanguageFile(body);
    return result;
  }

  @Post('/list-environments')
  @ApiResponse(listEnvironmentsExampleResponse)
  @ApiConsumes('application/json')
  @ApiBearerAuth()
  @RequirePermissions(Permissions.LANGUAGE_MANAGEMENT)
  async getListEnvironments() {
    const result = await this.languageService.getListEnvironments();
    return result;
  }
}
