import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from 'src/entity/banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
  ) {
  }

  async getBannerList() {
    return this.bannerRepository
      .createQueryBuilder('b')
      .select(
        `
        b.id,
        b.alias,
        b.imageSrc,
        b.title,
        b.link,
        b.description,
        b.startAt,
        b.endAt
        `,
      )
      .where(`b.isActive = 1 AND b.endAt > NOW()`)
      .orderBy('b.order', 'ASC')
      .getRawMany<BannerEntity>();
  }
}
