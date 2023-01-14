import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../../entity/category.entity';
import { ProductEntity } from '../../entity/product.entity';
import { ProductPropertyEntity } from '../../entity/productProperty.entity';
import { ConfigService } from '@nestjs/config';
import { IPagination } from '../../decorators/pagination.decorators';
import { IFilterModels } from '../filter/filter.types';
import { TSortPage } from '../../constants/sorting';
import { LISTEN_FILTERS } from '../../constants/filters';
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';
import { CollectionEntity } from '../../entity/collection.entity';
import { ProductService } from '../product/product.service';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductPropertyEntity)
    private readonly productPropertyRepository: Repository<ProductPropertyEntity>,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
    private readonly warehouseService: WarehouseService,
  ) {}

  async getProductsForMain(filterModels: IFilterModels, pagination: IPagination, sort: TSortPage) {
    return this.getProductsForCatalog(filterModels, pagination, sort);
  }

  async getProductsForCatalog(
    filterModels: IFilterModels,
    pagination: IPagination,
    sort: TSortPage,
  ): Promise<ProductEntity[]> {
    // TODO: sort добавіть

    const queryBuilder = await this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id, p.alias,
        p.title,
        p.description,
        JSON_OBJECT('id', cat.id, 'alias', cat.alias) as category
        `,
      )
      .where('p.isActive = 1')
      .groupBy('p.id')
      .limit(pagination.limit)
      .offset(pagination.offset);

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

    const productIds = products.map(({ id }) => id);
    const similarProductEntities = await Promise.all(
      productIds.map((productId) => {
        return this.warehouseService
          .getSimilarProducts(productId)
          .then((res) => ({ productId, similarProducts: res }));
      }),
    );

    const goodsEntities = await Promise.all(
      productIds.map((productId) => {
        return this.warehouseService.getProductsGoods(productId).then((res) => ({ productId, goods: res }));
      }),
    );

    return products.map((product) => {
      const matchGoods = goodsEntities.find(({ productId }) => productId === product.id);
      const matchSimilarProducts = similarProductEntities.find(({ productId }) => productId === product.id);

      return {
        ...product,
        goods: matchGoods ? matchGoods.goods : [],
        similarProducts: matchSimilarProducts ? matchSimilarProducts.similarProducts : [],
      };
    });
  }
}
