import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/decorators/pagination.decorators';
import { PROMOTION_STATUS, PromotionEntity } from 'src/entity/promotion.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { PromotionProductEntity } from 'src/entity/promotionProduct.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly promotionRepository: Repository<PromotionEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
  }

  async getHomePromotionList() {
    const promotions = await this.promotionRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.alias,
        p.title,
        p.description,
        p.startAt,
        p.endAt
        `,
      )
      .where(`p.status = :status AND p.endAt > NOW()`, { status: PROMOTION_STATUS.ACTIVE })
      .limit(6)
      .getRawMany<PromotionEntity>();

    return promotions;
  }

  async getPromotionList(pagination: IPagination) {
    const promotions = await this.promotionRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.alias,
        p.title,
        p.description,
        p.startAt,
        p.endAt
        `,
      )
      .where(`p.status = :status AND p.endAt > NOW()`, { status: PROMOTION_STATUS.ACTIVE })
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany<PromotionEntity>();

    return promotions;
  }

  async getPromotionProducts(promotionId: number) {
    return this.productRepository
      .createQueryBuilder('p')
      .select(`
        p.id,
        p.alias,
        p.title
      `)
      .where('p.status = :status', { status: PROMOTION_STATUS.ACTIVE })
      .innerJoin(PromotionProductEntity, 'pp', 'pp.promotionId = :promotionId', { promotionId })
      .groupBy('p.id')
      .getRawMany<ProductEntity>();
  }

  async getPromotion(alias: string) {
    const promotion = await this.promotionRepository
      .createQueryBuilder('p')
      .select(
        `
        p.id,
        p.alias,
        p.title,
        p.description,
        p.startAt,
        p.endAt
        `,
      )
      .where(`p.alias = :alias AND p.status = :status`, { alias, status: PROMOTION_STATUS.ACTIVE })
      .getRawOne<PromotionEntity>();

    if (!promotion) {
      throw new HttpException('Promotion not found', HttpStatus.NOT_FOUND);
    }

    return promotion;
  }
}
