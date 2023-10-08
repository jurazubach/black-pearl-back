import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { PRODUCT_STATUS, ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { IPagination } from 'src/decorators/pagination.decorators';
import { ESortPage, TSortPage } from 'src/constants/sorting';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { IFilterModels } from 'src/modules/filter/filter.types';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(WarehouseProductEntity)
    private readonly warehouseProductRepository: Repository<WarehouseProductEntity>,
  ) {}

  async getProducts(
    filterModels: IFilterModels,
    pagination: IPagination,
    sort: TSortPage,
  ): Promise<ProductEntity[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.alias,
        p.title
        `,
      )
      .where('p.status = :status', { status: PRODUCT_STATUS.ACTIVE })
      .groupBy('p.id, wp.id')
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

    if (filterModels.categories.length > 0) {
      const categoryIds = filterModels.categories.map(({ id }) => id);

      queryBuilder.innerJoin(
        CategoryEntity,
        'cat',
        'cat.id = p.categoryId AND cat.id IN (:categoryIds)',
        { categoryIds },
      );
    } else {
      queryBuilder.innerJoin(CategoryEntity, 'cat', 'cat.id = p.categoryId');
    }

    if (filterModels.sizes.length > 0) {
      const sizeAliases = filterModels.sizes.map(({ alias }) => alias);

      queryBuilder.innerJoin(
        WarehouseProductEntity,
        'wp',
        'wp.productId = p.id AND wp.size IN (:sizeAliases)',
        { sizeAliases },
      );
    } else {
      queryBuilder.innerJoin(WarehouseProductEntity, 'wp', 'wp.productId = p.id')
    }

    if (filterModels.properties.length > 0) {
      const propertyIds: number[] = [];
      const propertyValueIds: number[] = []

      filterModels.properties.forEach((filterProperty) => {
        propertyIds.push(filterProperty.id);
        propertyValueIds.push(...filterProperty.children.map(({ id }) => id));
      })

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

    const warehousePromises = products.map(({ id }, idx) => {
      return this.warehouseProductRepository
        .createQueryBuilder('wp')
        .select(`wp.id, wp.quantity, wp.price, wp.oldPrice, wp.size`)
        .where('wp.productId = :productId AND wp.quantity > 0', { productId: id })
        .getRawMany<WarehouseProductEntity>()
        .then((warehouseProducts) => ({ productIdx: idx, warehouseProducts }));
    });

    const warehouseProducts = await Promise.all(warehousePromises);
    warehouseProducts.forEach(({ productIdx, warehouseProducts }) => {
      Object.assign(products[productIdx], { warehouseProducts });
    });

    return products;
  }
}
