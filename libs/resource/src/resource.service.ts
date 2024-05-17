import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import Resource from './entities/Resource';

import {
  CommonStatus,
  ErrorCode,
  ResourceType,
} from '@app/core/constants/enum';
import { handleOutputPaging } from '@app/helpers/utils';
import { Exception } from '@app/core/exception';
import { GlobalCacheService } from '@app/cache';
import { LibraryConfigService } from 'libs/config/src/config.service';

const RESOURCE_VERSION = 'RESOURCE_VERSION';
// export const KEY_CACHE_RESOURCE = assignCachePrefix('KEY_CACHE_RESOURCE');

@Injectable()
export class ResourceService {
  constructor(
    private configService: LibraryConfigService,
    private dataSource: DataSource,
    private cacheManager: GlobalCacheService,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async getResourceInfo() {
    const KEY_CACHE_RESOURCE =
      this.cacheManager.createKeyCacheData('KEY_CACHE_RESOURCE');
    const cacheData = await this.cacheManager.del(KEY_CACHE_RESOURCE);
    if (cacheData) return JSON.parse(cacheData);

    const resources = await this.resourceRepository.find({
      where: {
        status: CommonStatus.ACTIVE,
      },
    });
    const result = resources.reduce((acc: any, cur: any) => {
      if (!acc[cur.type]) acc[cur.type] = [];
      acc[cur.type].push(cur);

      return acc;
    }, {});

    await this.cacheManager.set(KEY_CACHE_RESOURCE, JSON.stringify(result));
    return result;
  }

  async getListResource(params: IListResource) {
    const queryBuilder = this.resourceRepository
      .createQueryBuilder('resource')
      .select([
        'resource.id',
        'resource.name',
        'resource.status',
        'resource.order',
        'resource.type',
        'resource.createdBy',
      ])
      .take(params.take)
      .skip(params.skip)
      .where('1=1');

    if (params.type) {
      queryBuilder.andWhere('resource.type = :type', { type: params.type });
    }

    if (params.status) {
      queryBuilder.andWhere('resource.status = :status', {
        status: params.status,
      });
    }

    if (params.keyword) {
      queryBuilder.andWhere('LOWER(resource.name) like :name', {
        name: `%${params.keyword.toLowerCase()}%`,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('resource.order', 'ASC')
      .addOrderBy('resource.createdAt')
      .getManyAndCount();
    return handleOutputPaging(data, total, params);
  }

  async createResource(userId: number, params: IAddResource) {
    const KEY_CACHE_RESOURCE =
      this.cacheManager.createKeyCacheData('KEY_CACHE_RESOURCE');
    params.createdBy = userId;
    return await this.dataSource.transaction(async (transaction) => {
      await this.configService.updateVersionConfig(
        transaction,
        RESOURCE_VERSION,
      );
      await this.cacheManager.del(KEY_CACHE_RESOURCE);
      return await transaction.getRepository(Resource).save(params);
    });
  }

  async updateResource(resourceId: number, params: IUpdateResource) {
    const KEY_CACHE_RESOURCE =
      this.cacheManager.createKeyCacheData('KEY_CACHE_RESOURCE');
    await this.dataSource.transaction(async (transaction) => {
      const resourceRepository = transaction.getRepository(Resource);
      await resourceRepository.update(resourceId, { ...params });
      await this.configService.updateVersionConfig(
        transaction,
        RESOURCE_VERSION,
      );
    });
    await this.cacheManager.del(KEY_CACHE_RESOURCE);
    return;
  }

  async updateStatusResource(
    resourceId: number,
    params: IUpdateStatusResource,
  ) {
    return await this.dataSource.transaction(async (transaction) => {
      const KEY_CACHE_RESOURCE =
        this.cacheManager.createKeyCacheData('KEY_CACHE_RESOURCE');
      await this.configService.updateVersionConfig(
        transaction,
        RESOURCE_VERSION,
      );
      await this.resourceRepository.update(resourceId, { ...params });
      await this.cacheManager.del(KEY_CACHE_RESOURCE);
    });
  }

  async getDetailResource(resourceId: number) {
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });
    if (!resource) throw new Exception(ErrorCode.Not_Found);
    return resource;
  }

  async createResourceSingle(params: ICreateResourceSingle) {
    const KEY_CACHE_RESOURCE =
      this.cacheManager.createKeyCacheData('KEY_CACHE_RESOURCE');
    const resource = await this.resourceRepository.findOne({
      where: {
        type: params.type,
      },
    });

    if (resource)
      throw new Exception(
        ErrorCode.Resource_Already_Exists,
        'Resource already exist',
      );

    await this.resourceRepository.save(params);
    await this.cacheManager.del(KEY_CACHE_RESOURCE);
  }

  async getResourceByType(type: number) {
    const resource = await this.resourceRepository.find({
      where: {
        type: type,
        status: Not(CommonStatus.INACTIVE),
      },
    });
    return resource;
  }
}

export interface IListResource {
  take: number;
  pageIndex: number;
  start: number;
  skip: number;
  sort: any;
  keyword: string;
  status: number;
  type: ResourceType;
}

export interface IAddResource {
  name: string;
  type: ResourceType;
  createdBy: number;
}

export interface IUpdateResource {
  name: string;
}

export interface IUpdateStatusResource {
  status: number;
}

export interface ICreateResourceSingle {
  status: number;
  order: number;
  type: ResourceType;
  name: string;
  value: string;
  createdBy: number;
}
