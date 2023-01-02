import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../entity/product.entity';
import { WarehouseProductEntity } from '../../entity/warehouseProduct.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { WarehouseProductPropertyEntity } from '../../entity/warehouseProductProperty.entity';
import { formatProductProperties, IProductProperty } from '../product/product.helper';
import { I18nService } from 'nestjs-i18n';
import _capitalize from 'lodash/capitalize';
import _round from 'lodash/round';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(WarehouseProductEntity)
    private readonly warehouseProductRepository: Repository<WarehouseProductEntity>,
    @InjectRepository(WarehouseProductPropertyEntity)
    private readonly warehouseProductPropertyRepository: Repository<WarehouseProductPropertyEntity>,
    private readonly i18n: I18nService,
  ) {
  }

  async getPureProduct(alias: string) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .where('p.alias = :alias AND p.isActive = 1', { alias })
      .select(`p.id, p.alias`)
      .getRawOne<ProductEntity>();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async getSimilarProducts(productId: number, lang: string) {
    const similarProducts: any[] = [];

    const warehouseProducts = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity, wp.price, wp.oldPrice, JSON_OBJECT(
        'id', p.id,
        'alias', p.alias,
        'singleTitle', p.singleTitle${_capitalize(lang)},
        'multipleTitle', p.multipleTitle${_capitalize(lang)}
      ) as product`)
      .innerJoin(ProductEntity, 'p', 'p.id = wp.productId')
      .where('wp.productId = :productId', { productId })
      .getRawMany<WarehouseProductEntity>();

    const warehouseProductProperties = await Promise.all(warehouseProducts.map(({ id }) => {
      return this.warehouseProductPropertyRepository
        .createQueryBuilder('wpp')
        .select(`property.alias as propertyAlias, propertyValue.alias as propertyValueAlias`)
        .innerJoin(PropertyEntity, 'property', 'property.id = wpp.propertyId')
        .innerJoin(PropertyValueEntity, 'propertyValue', 'propertyValue.id = wpp.propertyValueId AND propertyValue.propertyId = property.id')
        .where('wpp.warehouseProductId = :warehouseProductId', { warehouseProductId: id })
        .getRawMany<IProductProperty>()
        .then(async (productProperties) => {
          const properties = await formatProductProperties(lang, this.i18n, productProperties);
          return { warehouseProductId: id, properties };
        });
    }));

    warehouseProducts.forEach(({ id, product, quantity, price, oldPrice }) => {
      const similarProductProperties = warehouseProductProperties.find((i) => i.warehouseProductId === id);
      if (similarProductProperties) {
        similarProducts.push({ id, product, quantity, price, oldPrice, similarProperties: similarProductProperties.properties });
      }
    });

    return similarProducts;
  }

  async calculateAvailableProductQuantity(
    productId: number,
    properties: Pick<IProductProperty, 'propertyId' | 'propertyValueId'>[],
  ): Promise<number> {
    const propertyIds: number[] = properties.map(({ propertyId }) => propertyId);
    const propertyValueIds: number[] = properties.map(({ propertyValueId }) => propertyValueId);

    const warehouseProduct = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity`)
      .innerJoin(ProductEntity, 'p', 'p.id = wp.productId')
      .innerJoin(
        WarehouseProductPropertyEntity,
        'wpp',
        'wpp.warehouseProductId = wp.id AND wpp.propertyId IN (:propertyIds) AND wpp.propertyValueId IN (:propertyValueIds)',
        { propertyIds, propertyValueIds },
      )
      .groupBy('wp.id')
      .where('wp.productId = :productId', { productId })
      .getRawOne<WarehouseProductEntity>();

    if (!warehouseProduct) {
      throw new HttpException('Product with properties not found', HttpStatus.NOT_FOUND);
    }

    return warehouseProduct.quantity;
  }

  async decreaseProductQuantity(
    productId: number,
    properties: Pick<IProductProperty, 'propertyId' | 'propertyValueId'>[],
    quantity: number,
  ): Promise<void> {
    const propertyIds: number[] = properties.map(({ propertyId }) => propertyId);
    const propertyValueIds: number[] = properties.map(({ propertyValueId }) => propertyValueId);

    const warehouseProduct = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity`)
      .innerJoin(ProductEntity, 'p', 'p.id = wp.productId')
      .innerJoin(
        WarehouseProductPropertyEntity,
        'wpp',
        'wpp.warehouseProductId = wp.id AND wpp.propertyId IN (:propertyIds) AND wpp.propertyValueId IN (:propertyValueIds)',
        { propertyIds, propertyValueIds },
      )
      .groupBy('wp.id')
      .where('wp.productId = :productId', { productId })
      .getRawOne<WarehouseProductEntity>();

    if (!warehouseProduct) {
      throw new HttpException('Product with properties not found', HttpStatus.NOT_FOUND);
    }

    if (warehouseProduct.quantity < quantity) {
      throw new HttpException(
        `Warehouse [ID:${warehouseProduct.id}] quantity is ${warehouseProduct.quantity} and this is less than: ${quantity}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.warehouseProductRepository
      .createQueryBuilder()
      .update({ quantity: _round(warehouseProduct.quantity - quantity, 0) })
      .where("id = :id", { id: warehouseProduct.id })
      .execute();
  }
}
