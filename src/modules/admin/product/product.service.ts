import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { CollectionEntity } from 'src/entity/collection.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { CollectionProductEntity } from 'src/entity/collectionProduct.entity';
import { IPropertyWithValue } from './product.helper';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';
import { IPagination } from 'src/decorators/pagination.decorators';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(ProductPropertyEntity)
    private readonly productPropertyRepository: Repository<ProductPropertyEntity>,
    @InjectRepository(WarehouseProductEntity)
    private readonly warehouseProductRepository: Repository<WarehouseProductEntity>,
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

  async getSimilarProducts(productId: number) {
    const similarProducts = await this.productRepository
      .createQueryBuilder('p')
      .select(`p.id, p.alias, p.title, p.description`)
      .innerJoin(SimilarProductEntity, 'sp', 'sp.similarProductId = p.id')
      .where('sp.productId = :productId AND p.isActive = 1', { productId })
      .groupBy('p.id')
      .getRawMany<ProductEntity>();

    const goodsProductsEntities = await Promise.all(
      similarProducts.map(({ id }) => {
        return this.warehouseProductRepository
          .createQueryBuilder('wp')
          .select(`wp.id, wp.quantity, wp.price, wp.costPrice, wp.oldPrice, wp.size`)
          .where('wp.productId = :productId AND wp.quantity > 0', { productId: id })
          .orderBy('wp.price', 'ASC')
          .getRawMany<WarehouseProductEntity>()
          .then((res) => ({ productId: id, minimalGoods: res }));
      }),
    );

    similarProducts.forEach((similarProduct) => {
      const matchGoods = goodsProductsEntities.find(({ productId }) => similarProduct.id === productId);

      Object.assign(similarProduct, { goods: matchGoods && matchGoods.minimalGoods ? matchGoods.minimalGoods : [] });
    });

    return similarProducts;
  }

  async getProductOptions() {
    return this.productRepository
      .createQueryBuilder('p')
      .select(`p.id, p.alias, p.title, p.code`)
      .getRawMany<ProductEntity>();
  }

  async getProductList(pagination: IPagination) {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.code,
        p.alias,
        p.title,
        p.description,
        p.isActive,
        JSON_OBJECT(
          'id', c.id,
          'alias', c.alias,
          'singleTitle', c.singleTitle,
          'multipleTitle', c.multipleTitle,
          'description', c.description
        ) as category
        `,
      )
      .innerJoin(CategoryEntity, 'c', 'c.id = p.categoryId')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany<ProductEntity>();

    const collections = await Promise.all(products.map((product) => {
      return this.getProductCollection(product.id).then((collection) => ({
        productId: product.id,
        collection,
      }));
    }));

    for await (const product of products) {
      const matchCollection = collections.find((i) => i.productId === product.id);

      Object.assign(product, {
        collection: matchCollection ? matchCollection.collection : null,
      });
    }

    return products;
  }

  async getPublicProduct(alias: string) {
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
          'id', c.id,
          'alias', c.alias,
          'singleTitle', c.singleTitle,
          'multipleTitle', c.multipleTitle,
          'description', c.description
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
    const collection = await this.getProductCollection(product['id']);

    const goods = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity, wp.price, wp.costPrice, wp.oldPrice, wp.size`)
      .where('wp.productId = :productId', { productId: product['id'] })
      .getRawMany<WarehouseProductEntity>();

    const similarProducts = await this.getSimilarProducts(product['id']);

    return {
      ...product,
      collection,
      properties,
      goods,
      similarProducts,
    };
  }

  async getProduct(id: number) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.code,
        p.alias,
        p.title,
        p.description,
        JSON_OBJECT(
          'id', c.id,
          'alias', c.alias,
          'singleTitle', c.singleTitle,
          'multipleTitle', c.multipleTitle,
          'description', c.description
        ) as category
        `,
      )
      .where(`p.id = :id`, { id })
      .innerJoin(CategoryEntity, 'c', 'c.id = p.categoryId')
      .getRawOne<ProductEntity>();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const properties = await this.getProductProperties(product['id']);
    const similarProducts = await this.getSimilarProducts(product['id']);

    return {
      ...product,
      properties,
      similarProducts,
    };
  }

  async getProductCollection(productId: number) {
    const collection = await this.collectionRepository
      .createQueryBuilder('c')
      .select(`c.id, c.alias, c.title, c.description`)
      .innerJoin(CollectionProductEntity, 'cp', 'cp.productId = :productId', { productId })
      .getRawOne<CollectionEntity>();

    if (!collection) {
      return null;
    }

    return collection;
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
