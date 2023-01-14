import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entity/product.entity';
import { TWarehouseProductSize, WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import _round from 'lodash/round';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(WarehouseProductEntity)
    private readonly warehouseProductRepository: Repository<WarehouseProductEntity>,
    @InjectRepository(SimilarProductEntity)
    private readonly similarProductRepository: Repository<SimilarProductEntity>
  ) {}

  async getPureProduct(alias: string) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .where('p.alias = :alias', { alias })
      .select(`p.id, p.alias`)
      .getRawOne<ProductEntity>();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async getProductsGoods(productId: number) {
    return this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity, wp.price, wp.oldPrice, wp.size`)
      .where('wp.productId = :productId', { productId })
      .getRawMany<WarehouseProductEntity>();
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
          .select(`wp.id, wp.quantity, wp.price, wp.oldPrice, wp.size`)
          .where('wp.productId = :productId AND wp.quantity > 0', { productId: id })
          .orderBy('wp.price', 'ASC')
          .getRawOne<WarehouseProductEntity>()
          .then((res) => ({ productId: id, minimalGoods: res }));
      }),
    );

    similarProducts.forEach((similarProduct) => {
      const matchGoods = goodsProductsEntities.find(({ productId }) => similarProduct.id === productId);

      Object.assign(similarProduct, { goods: matchGoods && matchGoods.minimalGoods ? [matchGoods.minimalGoods] : [] });
    });

    return similarProducts;
  }

  async calculateAvailableProductQuantity(productId: number, size: TWarehouseProductSize): Promise<number> {
    const warehouseProduct = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity`)
      .innerJoin(ProductEntity, 'p', 'p.id = wp.productId')
      .groupBy('wp.id')
      .where('wp.productId = :productId AND wp.size = :size', { productId, size })
      .getRawOne<WarehouseProductEntity>();

    if (!warehouseProduct) {
      throw new HttpException('Product with size not found', HttpStatus.NOT_FOUND);
    }

    return warehouseProduct.quantity;
  }

  async decreaseProductQuantity(productId: number, quantity: number, size: TWarehouseProductSize): Promise<void> {
    const warehouseProduct = await this.warehouseProductRepository
      .createQueryBuilder('wp')
      .select(`wp.id, wp.quantity`)
      .innerJoin(ProductEntity, 'p', 'p.id = wp.productId')
      .groupBy('wp.id')
      .where('wp.productId = :productId AND wp.size = :size', { productId, size })
      .getRawOne<WarehouseProductEntity>();

    if (!warehouseProduct) {
      throw new HttpException('Product with size not found', HttpStatus.NOT_FOUND);
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
      .where('id = :id', { id: warehouseProduct.id })
      .execute();
  }
}
