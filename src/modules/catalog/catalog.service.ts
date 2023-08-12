import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { IPagination } from 'src/decorators/pagination.decorators';
import { ESortPage, TSortPage } from 'src/constants/sorting';
import { LISTEN_FILTERS } from 'src/constants/filters';
import { CollectionProductEntity } from 'src/entity/collectionProduct.entity';
import { CollectionEntity } from 'src/entity/collection.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { IFilterModels } from '../filter/filter.types';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getProducts(
    filterModels: IFilterModels,
    pagination: IPagination,
    sort: TSortPage,
  ): Promise<ProductEntity[]> {
    // TODO: sort добавіть

    const queryBuilder = this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.alias,
        p.title,
        JSON_OBJECT(
          'alias', cat.alias,
          'singleTitle', cat.singleTitle,
          'multipleTitle', cat.multipleTitle
        ) as category
        `,
      )
      .where('p.isActive = 1')
      .groupBy('p.id')
      .innerJoin(WarehouseProductEntity, 'wp', 'wp.productId = p.id')
      .limit(pagination.limit)
      .offset(pagination.offset);

    if (sort === ESortPage.POPULAR) {
      // TODO: смотреть по кол-во заказаных товаров за последний месяц
      queryBuilder.orderBy('p.createdAt', 'DESC');
    } else if (sort === ESortPage.ASC_PRICE) {
      queryBuilder.orderBy('wp.price', 'ASC');
    } else if (sort === ESortPage.DESC_PRICE) {
      queryBuilder.orderBy('wp.price', 'DESC');
    } else if (sort === ESortPage.NOVELTY) {
      queryBuilder.orderBy('p.createdAt', 'DESC');
    }

    if (filterModels[LISTEN_FILTERS.CATEGORIES]) {
      const categoryIds = filterModels[LISTEN_FILTERS.CATEGORIES].map(({ id }) => id);
      queryBuilder.innerJoin(CategoryEntity, 'cat', 'cat.id = p.categoryId AND cat.id IN (:categoryIds)', { categoryIds });
    } else {
      queryBuilder.innerJoin(CategoryEntity, 'cat', 'cat.id = p.categoryId');
    }

    if (filterModels[LISTEN_FILTERS.COLLECTIONS]) {
      const collectionIds = filterModels[LISTEN_FILTERS.COLLECTIONS].map(({ id }) => id);
      queryBuilder
        .innerJoin(CollectionEntity, 'col', 'col.id IN (:collectionIds)', { collectionIds })
        .innerJoin(CollectionProductEntity, 'colProd', 'colProd.collectionId = col.id AND colProd.productId = p.id');
    }

    if (filterModels[LISTEN_FILTERS.PROPERTIES] || filterModels[LISTEN_FILTERS.PROPERTY_VALUES]) {
      const propertyIds = filterModels[LISTEN_FILTERS.PROPERTIES]
        ? filterModels[LISTEN_FILTERS.PROPERTIES].map(({ id }) => id)
        : [];
      const propertyValueIds = filterModels[LISTEN_FILTERS.PROPERTY_VALUES]
        ? filterModels[LISTEN_FILTERS.PROPERTY_VALUES].map(({ id }) => id)
        : [];

      queryBuilder.innerJoin(
        ProductPropertyEntity,
        'pp',
        `
          pp.productId = p.id
          ${propertyIds.length > 0 ? ' AND pp.propertyId IN (:propertyIds)' : ''}
          ${propertyValueIds.length > 0 ? ' AND pp.propertyValueId IN (:propertyValueIds)' : ''}
        `,
        { propertyIds, propertyValueIds },
      );
    }

    const products = await queryBuilder.getRawMany<ProductEntity>();

    return products;
  }
}
