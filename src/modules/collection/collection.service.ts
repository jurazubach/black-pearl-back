import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import glob from 'glob';
import { CollectionEntity } from '../../entity/collection.entity';
import { ConfigService } from '@nestjs/config';
import _last from 'lodash/last';
import { IPagination } from '../../decorators/pagination.decorators';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {}

  async getCollection(alias: string) {
    const collection = await this.collectionRepository
      .createQueryBuilder('c')
      .select(`c.id, c.alias, c.title, c.description`)
      .where('c.alias = :alias', { alias })
      .getRawOne<CollectionEntity>();

    if (!collection) {
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);
    }

    return this.wrapCollection(collection);
  }

  async wrapCollection(collection: CollectionEntity) {
    const images = await this.getCollectionImages(collection.alias);
    Object.assign(collection, { images });

    return collection;
  }

  async getCollectionImages(collectionAlias: string) {
    const paths: string[] = [];

    const protocol = this.configService.get<string>('API_PROTOCOL');
    const host = this.configService.get<string>('API_HOST');
    const port = this.configService.get<string>('API_PORT');
    const portPart = port ? `:${port}` : '';
    const hostname = `${protocol}://${host}${portPart}/images/collections/${collectionAlias}`;

    const files = glob.sync(`src/public/images/collections/${collectionAlias}/*`, { realpath: true });
    for await (const filePath of files) {
      const image = _last(filePath.split('/'));
      paths.push(`${hostname}/${image}`);
    }

    return paths;
  }

  async getCollectionList(pagination: IPagination) {
    const collections = await this.collectionRepository
      .createQueryBuilder('c')
      .select(`c.id, c.alias, c.title, c.description`)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany<CollectionEntity>();

    return Promise.all(collections.map((collection) => this.wrapCollection(collection)));
  }
}
