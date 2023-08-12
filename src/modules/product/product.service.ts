import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';
import { LookEntity } from 'src/entity/look.entity';
import { ESortPage } from 'src/constants/sorting';
import { LookProductEntity } from 'src/entity/lookProduct.entity';

export interface IProperty {
  id: number;
  alias: string;
  title: string;
}

export type IPropertyValue = IProperty

export interface IPropertyWithValue {
  property: IProperty;
  value: IPropertyValue;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductPropertyEntity)
    private readonly productPropertyRepository: Repository<ProductPropertyEntity>,
    @InjectRepository(WarehouseProductEntity)
    private readonly warehouseProductRepository: Repository<WarehouseProductEntity>,
    @InjectRepository(LookEntity)
    private readonly lookRepository: Repository<LookEntity>,
  ) {
  }

  async getPureProduct(where: { [key: string]: any }) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .where(where)
      .select(`p.id, p.alias`)
      .getRawOne<ProductEntity>();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async getHomeProducts(sort: ESortPage.POPULAR | ESortPage.NOVELTY) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.alias,
        p.title
        `,
      )
      .where('p.isActive = 1 AND wp.quantity > 0')
      .limit(6)
      .innerJoin(WarehouseProductEntity, 'wp', 'wp.productId = p.id');

    // TODO: придумать как сортировать
    if (sort === ESortPage.NOVELTY) {
      queryBuilder.orderBy('p.createdAt', 'DESC');
    } else if (sort === ESortPage.POPULAR) {
      queryBuilder.orderBy('p.createdAt', 'DESC');
    }

    const products = await queryBuilder.limit(6).getRawMany<ProductEntity>();

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

  async getLookByProductId(productId: number) {
    const look = await this.lookRepository
      .createQueryBuilder('l')
      .select(`l.*`)
      .innerJoin(LookProductEntity, 'lp', 'lp.productId = :productId', { productId })
      .getRawOne<LookEntity>();

    if (!look) {
      throw new HttpException('Look not found', HttpStatus.NOT_FOUND);
    }

    return look;
  }

  async getLookProducts(lookId: number) {
    return this.productRepository
      .createQueryBuilder('p')
      .select(`
        p.id,
        p.alias,
        p.title
      `)
      .where('p.isActive = 1 AND lp.lookId = :lookId', { lookId })
      .innerJoin(LookProductEntity, 'lp', 'lp.productId = p.id')
      .groupBy('p.id')
      .getRawMany<ProductEntity>();
  }

  async getSimilarProducts(productId: number) {
    const similarProducts = await this.productRepository
      .createQueryBuilder('p')
      .select(`p.id, p.alias, p.title`)
      .innerJoin(SimilarProductEntity, 'sp', 'sp.similarProductId = p.id')
      .where('sp.productId = :productId AND p.isActive = 1', { productId })
      .groupBy('p.id')
      .getRawMany<ProductEntity>();

    const warehouseProducts = await Promise.all(
      similarProducts.map(({ id }, idx) => {
        return this.warehouseProductRepository
          .createQueryBuilder('wp')
          .select(`wp.id, wp.quantity, wp.price, wp.oldPrice, wp.size`)
          .where('wp.productId = :productId AND wp.quantity > 0', { productId: id })
          .getRawMany<WarehouseProductEntity>()
          .then((res) => ({ productIdx: idx, warehouseProducts: res }));
      }),
    );

    warehouseProducts.forEach(({ productIdx, warehouseProducts }) => {
      Object.assign(similarProducts[productIdx], { warehouseProducts });
    });

    return similarProducts;
  }

  async getProduct(alias: string) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.alias,
        p.code,
        p.title,
        p.description,
        JSON_OBJECT(
          'alias', c.alias,
          'singleTitle', c.singleTitle,
          'multipleTitle', c.multipleTitle
        ) as category
        `,
      )
      .where(`p.alias = :alias AND p.isActive = 1`, { alias })
      .innerJoin(CategoryEntity, 'c', 'c.id = p.categoryId')
      .getRawOne<ProductEntity>();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const properties = await this.getProductProperties(product['id']);

    const warehouseProducts = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity, wp.price, wp.oldPrice, wp.size`)
      .where('wp.productId = :productId', { productId: product['id'] })
      .getRawMany<WarehouseProductEntity>();

    const similarProducts = await this.getSimilarProducts(product['id']);

    return {
      ...product,
      properties,
      warehouseProducts,
      similarProducts,
    };
  }

  async getProductProperties(productId: number) {
    return this.productPropertyRepository
      .createQueryBuilder('pp')
      .select(`
        JSON_OBJECT('id', property.id, 'alias', property.alias, 'title', property.title) as property,
        JSON_OBJECT('id', propertyValue.id, 'alias', propertyValue.alias, 'title', propertyValue.title) as value
      `)
      .where('product.id = :id AND product.isActive = 1', { id: productId })
      .innerJoin(ProductEntity, 'product', 'product.id = pp.productId')
      .innerJoin(PropertyEntity, 'property', 'property.id = pp.propertyId')
      .innerJoin(
        PropertyValueEntity,
        'propertyValue',
        'propertyValue.id = pp.propertyValueId AND propertyValue.propertyId = property.id',
      )
      .getRawMany<IPropertyWithValue>();
  }
}
