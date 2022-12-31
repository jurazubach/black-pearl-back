import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../entity/product.entity';
import { WarehouseProductEntity } from '../../entity/warehouseProduct.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { WarehouseProductPropertyEntity } from '../../entity/warehouseProductProperty.entity';
import { IProductProperty } from '../product/product.service';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(WarehouseProductEntity)
    private readonly warehouseProductRepository: Repository<WarehouseProductEntity>,
    @InjectRepository(WarehouseProductPropertyEntity)
    private readonly warehouseProductPropertyRepository: Repository<WarehouseProductPropertyEntity>,
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

  async getSimilarProducts(productId: number) {
    const similarProducts: any[] = [];

    const warehouseProducts = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.amount, wp.price, wp.oldPrice`)
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
        .then((res) => ({ warehouseProductId: id, properties: res }));
    }));

    warehouseProducts.forEach(({ id, amount, price, oldPrice }) => {
      const similarProductProperties = warehouseProductProperties.find((i) => i.warehouseProductId === id);
      if (similarProductProperties) {
        const similarProperties = similarProductProperties.properties.map((i) => {
          return { property: { alias: i.propertyAlias }, value: { alias: i.propertyValueAlias } };
        });

        similarProducts.push({ id, amount, price, oldPrice, similarProperties });
      }
    });

    return similarProducts;
  }
}
