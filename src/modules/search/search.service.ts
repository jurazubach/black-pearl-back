import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PRODUCT_STATUS, ProductEntity } from 'src/entity/product.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
  }

  async searchByText(text: string) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('p')
      .select(
        `
        p.code,
        p.alias,
        p.title
        `,
      )
      .where(`p.status = :status`, { status: PRODUCT_STATUS.ACTIVE })
      .andWhere('MATCH (p.code) AGAINST (:query IN BOOLEAN MODE) OR MATCH (p.title) AGAINST (:query IN BOOLEAN MODE)', { query: `+${text}` })
      .limit(12);

    return queryBuilder.getRawMany<ProductEntity>();
  }
}
