import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionEntity } from '../../entity/collection.entity';
import { IPagination } from '../../decorators/pagination.decorators';
import { CollectionDto } from './collection.dto';
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';
import { ProductEntity } from '../../entity/product.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(CollectionProductEntity)
    private readonly collectionProductRepository: Repository<CollectionProductEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
  }

  async getPublicCollectionByAlias(alias: string) {
    const collection = await this.collectionRepository
      .createQueryBuilder('c')
      .select(`c.id, c.alias, c.title, c.description, c.isActive`)
      .where('c.alias = :alias AND c.isActive = 1', { alias })
      .getRawOne<CollectionEntity>();

    if (!collection) {
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);
    }

    const products = await this.productRepository
      .createQueryBuilder('p')
      .select(`p.id, p.alias, p.title`)
      .innerJoin(CollectionProductEntity, 'cp', 'cp.productId = p.id')
      .where('cp.collectionId = :collectionId AND p.isActive = 1', { collectionId: collection.id })
      .groupBy('p.id')
      .getRawMany<ProductEntity>();

    Object.assign(collection, { products });

    return collection;
  }

  async getCollectionByID(id: number) {
    const collection = await this.collectionRepository
      .createQueryBuilder('c')
      .select(`c.id, c.alias, c.title, c.description, c.isActive`)
      .where('c.id = :id', { id })
      .getRawOne<CollectionEntity>();

    if (!collection) {
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);
    }

    const products = await this.productRepository
      .createQueryBuilder('p')
      .select(`p.id, p.alias, p.title`)
      .innerJoin(CollectionProductEntity, 'cp', 'cp.productId = p.id')
      .where('cp.collectionId = :collectionId', { collectionId: collection.id })
      .groupBy('p.id')
      .getRawMany<ProductEntity>();

    Object.assign(collection, { products });

    return collection;
  }

  async getCollectionList(pagination: IPagination) {
    return this.collectionRepository
      .createQueryBuilder('c')
      .select(`c.id, c.alias, c.title, c.description, c.isActive, COUNT(cp.id) as countProducts`)
      .leftJoin(CollectionProductEntity, 'cp', 'cp.collectionId = c.id')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .groupBy('c.id')
      .getRawMany<CollectionEntity>();
  }

  async createCollection(payload: CollectionDto) {
    const collectionEntity = new CollectionEntity();
    Object.assign(collectionEntity, {
      alias: payload.alias,
      title: payload.title,
      description: payload.description,
      isActive: payload.isActive,
    });

    const collection = await this.collectionRepository.save(collectionEntity);

    const collectionProducts = payload.productIds.map((productId) => {
      const collectionProductEntity = new CollectionProductEntity();
      Object.assign(collectionProductEntity, { collectionId: collection.id, productId });

      return collectionProductEntity;
    });

    await this.collectionProductRepository.save(collectionProducts);

    return collection;
  }

  async updateCollection(id: number, payload: CollectionDto) {
    const collection = await this.collectionRepository
      .createQueryBuilder('c')
      .where({ id })
      .select('*')
      .getRawOne<CollectionEntity>();

    if (!collection) throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);

    Object.assign(collection, {
      alias: payload.alias,
      title: payload.title,
      description: payload.description,
      isActive: payload.isActive,
    });

    await this.collectionRepository
      .createQueryBuilder()
      .update(collection)
      .where('id = :id', { id })
      .execute();

    await this.collectionProductRepository.delete({ collectionId: collection.id });

    const collectionProducts = payload.productIds.map((productId) => {
      const collectionProductEntity = new CollectionProductEntity();
      Object.assign(collectionProductEntity, { collectionId: collection.id, productId });

      return collectionProductEntity;
    });

    await this.collectionProductRepository.save(collectionProducts);

    return collection;
  }

  async deleteCollection(id: number) {
    const collection = await this.collectionRepository
      .createQueryBuilder('c')
      .where({ id })
      .select('id')
      .getRawOne<CollectionEntity>();

    if (!collection) throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);

    await this.collectionProductRepository.delete({ collectionId: collection.id });

    return this.collectionRepository.delete({ id: collection.id });
  }
}
