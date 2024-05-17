import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import Language from './entities/Language';
import LanguageEnv from './entities/LanguageEnv';
import LanguageKey from './entities/LanguageKey';
import LanguageTranslation from './entities/LanguageTranslation';
import * as flatten from 'flat';
import { CommonStatus, ErrorCode } from '@app/core/constants/enum';
import { Exception } from '@app/core/exception';
import { handleOutputPaging, reformatFileLanguage } from '@app/helpers/utils';
import { GlobalCacheService } from '@app/cache';
import { LibraryConfigService } from 'libs/config/src/config.service';

const LANGUAGE_VERSION = 'LANGUAGE_VERSION';

@Injectable()
export class LanguageService {
  constructor(
    private readonly configService: LibraryConfigService,
    private readonly dataSource: DataSource,
    private cacheManager: GlobalCacheService,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(LanguageEnv)
    private languageEnvRepository: Repository<LanguageEnv>,
    @InjectRepository(LanguageKey)
    private languageKeyRepository: Repository<LanguageKey>,
    @InjectRepository(LanguageTranslation)
    private languageTranslationRepository: Repository<LanguageTranslation>,
  ) {}

  async getListLanguage(params: IListLanguage) {
    const queryBuilder = this.languageRepository.createQueryBuilder('l');

    if (params.status) {
      queryBuilder.andWhere('l.status = :status', { status: params.status });
    }

    const result = await queryBuilder
      .orderBy('l.isDefault', 'DESC')
      .addOrderBy('l.priority', 'ASC')
      .getMany();
    return result;
  }

  /**
   * The first language added is alway the default language.
   * If the new language added is the default language,
   * update the old language default to inactive.
   * @param params
   */
  async addLanguage(params: IAddLanguage) {
    return await this.dataSource.transaction(async (transaction) => {
      const languageRepository = transaction.getRepository(Language);
      if (params.isDefault === CommonStatus.ACTIVE) {
        await languageRepository.update(
          { isDefault: CommonStatus.ACTIVE },
          { isDefault: CommonStatus.INACTIVE },
        );
      }

      if (params.isDefault === CommonStatus.INACTIVE) {
        const hasDefaultLanguage = await languageRepository.count({
          where: {
            status: CommonStatus.ACTIVE,
            isDefault: CommonStatus.ACTIVE,
          },
        });

        if (!hasDefaultLanguage) {
          params.isDefault = CommonStatus.ACTIVE;
        }
      }

      await languageRepository.save(params);
    });
  }

  /**
   * Can not update isDefault from Active to Inactive.
   * If the admin update language isDefault from inactive to active, update the old default language to inactive.
   * @param params
   */
  async updateLanguage(params: IUpdateLanguage) {
    return await this.dataSource.transaction(async (transaction) => {
      const languageRepository = transaction.getRepository(Language);

      const language = await languageRepository.findOne({
        where: {
          code: params.code,
        },
      });
      if (!language)
        throw new Exception(ErrorCode.Not_Found, 'This language not found');

      if (
        params.status === CommonStatus.INACTIVE &&
        language.isDefault === CommonStatus.ACTIVE
      ) {
        throw new Exception(
          ErrorCode.Can_Not_Disable_Default_language,
          'You can not disable default language.',
        );
      }

      if (
        params.isDefault === CommonStatus.INACTIVE &&
        language.isDefault === CommonStatus.ACTIVE
      ) {
        throw ErrorCode.Can_Not_Disable_Default_language;
      }

      if (
        params.isDefault === CommonStatus.ACTIVE &&
        language.isDefault !== CommonStatus.ACTIVE
      ) {
        await languageRepository.update(
          { isDefault: CommonStatus.ACTIVE },
          { isDefault: CommonStatus.INACTIVE },
        );
      }

      await languageRepository.update({ code: params.code }, params);
    });
  }

  /**
   * LANGUAGE KEY
   */
  async getListLanguageKey(params: IListLanguageKey) {
    const queryBuilder = this.languageKeyRepository
      .createQueryBuilder('lk')
      .leftJoinAndMapMany(
        'lk.translations',
        LanguageTranslation,
        'lt',
        'lk.key = lt.key AND lk.environment = lt.environment',
      )
      .leftJoin(Language, 'l', 'l.code = lt.code AND l.status = :status', {
        status: CommonStatus.ACTIVE,
      })
      .select([
        'lk.key',
        'lk.defaultValue',
        'lk.environment',
        'lt.code',
        'lt.value',
      ]);

    if (params.keyword) {
      queryBuilder.andWhere(
        '(LOWER(lk.key) LIKE :keyword OR LOWER(lt.value LIKE :keyword))',
        {
          keyword: `%${params.keyword.toLocaleLowerCase()}%`,
        },
      );
    }

    if (params.environments && params.environments.length) {
      queryBuilder.andWhere('lk.environment IN(:environments)', {
        environments: params.environments,
      });
    }

    const [data, totalItems] = await queryBuilder
      .skip(params.skip)
      .take(params.take)
      .getManyAndCount();

    await this.assignLanguageTranslation(this.languageRepository, data);
    return handleOutputPaging(data, totalItems, params);
  }

  /**
   * assign null value
   */
  async assignLanguageTranslation(
    languageRepository: Repository<Language>,
    data: Array<any>,
  ) {
    const languages = await languageRepository.find({
      where: { status: CommonStatus.ACTIVE },
      select: ['code'],
      order: { isDefault: 'DESC' },
    });

    data.forEach((item) => {
      item['translations'] = languages.map((element) => {
        const el = item['translations'].find(
          (x: any) => x.code === element.code,
        );
        const value = el?.value ?? null;
        return { code: element.code, value };
      });
    });
  }

  async addLanguageKey({ translations, ...params }: IAddLanguageKey) {
    await this.dataSource.transaction(async (transaction) => {
      const languageKeyRepository = transaction.getRepository(LanguageKey);
      const languageTranslationRepository =
        transaction.getRepository(LanguageTranslation);

      const KEY_CACHE_LANGUAGE =
        this.cacheManager.createKeyCacheData('KEY_CACHE_LANGUAGE');

      translations.forEach((item) => {
        item.environment = params.environment;
        item.key = params.key;
      });
      await languageKeyRepository.save(params);
      await languageTranslationRepository.save(translations);
      await this.cacheManager.del(KEY_CACHE_LANGUAGE);
      await this.configService.updateVersionConfig(
        transaction,
        LANGUAGE_VERSION,
      );
    });
  }

  async updateLanguageKey({ translations, ...params }: any) {
    await this.dataSource.transaction(async (transaction) => {
      const languageTranslationRepository =
        transaction.getRepository(LanguageTranslation);
      const languageKeyRepository = transaction.getRepository(LanguageKey);

      const KEY_CACHE_LANGUAGE =
        this.cacheManager.createKeyCacheData('KEY_CACHE_LANGUAGE');

      await languageTranslationRepository.delete({
        key: params.key,
        environment: params.environment,
      });

      translations.forEach((item: any) => {
        item.environment = params.environment;
        item.key = params.key;
      });

      await languageKeyRepository.save(params);
      await languageTranslationRepository.save(translations);
      await this.cacheManager.del(KEY_CACHE_LANGUAGE);
      await this.configService.updateVersionConfig(
        transaction,
        LANGUAGE_VERSION,
      );
    });
  }

  /**
   * Get and unflatten key language
   * @param params
   */
  async getFileLanguage(params: IGetFileLanguage | any) {
    const KEY_CACHE_LANGUAGE =
      this.cacheManager.createKeyCacheData('KEY_CACHE_LANGUAGE');

    const cacheData = (await this.cacheManager.get(KEY_CACHE_LANGUAGE)) as any;
    if (cacheData) {
      return reformatFileLanguage(JSON.parse(cacheData), params);
    }

    const queryBuilder = this.languageKeyRepository
      .createQueryBuilder('lk')
      .select([
        'lk.key `key`',
        'lt.code code',
        'IFNULL(lt.value, lk.defaultValue) value',
      ])
      .innerJoin(
        LanguageTranslation,
        'lt',
        'lk.key = lt.key AND lk.environment = lt.environment',
      )
      .innerJoin(Language, 'l', 'l.status = :status AND lt.code = l.code', {
        status: CommonStatus.ACTIVE,
      })
      .where('lk.environment = :environment', {
        environment: params.environment,
      });

    const data = await queryBuilder.getRawMany();
    await this.cacheManager.set(KEY_CACHE_LANGUAGE, JSON.stringify(data));

    return reformatFileLanguage(data, params);
  }

  async downloadFileLanguage(params: IGetFileLanguage | any) {
    const queryBuilder = this.languageKeyRepository
      .createQueryBuilder('lk')
      .select([
        'lk.key `key`',
        'lt.code code',
        'IFNULL(lt.value, lk.defaultValue) value',
      ])
      .innerJoin(
        LanguageTranslation,
        'lt',
        'lk.key = lt.key AND lk.environment = lt.environment',
      )
      .innerJoin(Language, 'l', 'l.status = :status AND lt.code = l.code', {
        status: CommonStatus.ACTIVE,
      })
      .where('lk.environment = :environment', {
        environment: params.environment,
      });

    const data = await queryBuilder.getRawMany();
    return reformatFileLanguage(data, params);
  }

  async uploadLanguageFile({ environment, code, languages }: any) {
    const flatData = flatten(languages) as any;
    const keys = Object.keys(flatData);

    const params = keys.reduce(
      (acc: any, cur: any) => {
        acc.languageTranslation.push({
          key: cur,
          code,
          environment,
          value: flatData[cur],
        });
        acc.languageKey.push({
          key: cur,
          environment,
          defaultValue: cur,
        });
        return acc;
      },
      { languageKey: [], languageTranslation: [] },
    );

    return await this.dataSource.transaction(async (transaction) => {
      const languageRepository = transaction.getRepository(LanguageKey);
      const languageTranslationRepository =
        transaction.getRepository(LanguageTranslation);

      const KEY_CACHE_LANGUAGE =
        this.cacheManager.createKeyCacheData('KEY_CACHE_LANGUAGE');

      await languageRepository.save(params.languageKey);
      await languageTranslationRepository.save(params.languageTranslation);
      await this.cacheManager.del(KEY_CACHE_LANGUAGE);
      await this.configService.updateVersionConfig(
        transaction,
        LANGUAGE_VERSION,
      );
    });
  }

  async getListEnvironments() {
    const environments = await this.languageEnvRepository.find({
      where: {
        status: CommonStatus.ACTIVE,
      },
    });
    return environments;
  }
}

export interface IListLanguage {
  status?: CommonStatus;
}

export interface IFileLanguage {
  environment: string;
}

export interface IAddLanguage {
  code: string;
  name: string;
  status: CommonStatus;
  viName: string;
  priority: number;
  flagIcon: string;
  isDefault: CommonStatus;
  createdAt?: string;
}

export interface IUpdateLanguage {
  code: string;
  name: string;
  status: CommonStatus;
  viName: string;
  priority: number;
  flagIcon: string;
  isDefault: CommonStatus;
  createdAt?: string;
}

export interface IListLanguageKey {
  skip: number;
  take: number;
  keyword: string;
  environments: string[];
}

export interface IAddLanguageKey {
  key: string;
  defaultValue: string;
  environment: string;
  translations: Array<{
    code: string;
    value: string;
    environment?: string;
    key?: string;
  }>;
}

export interface IGetFileLanguage {
  environment: string;
  code?: string;
}
