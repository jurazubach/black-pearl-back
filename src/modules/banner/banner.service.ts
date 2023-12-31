import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BANNER_STATUS, BannerEntity } from 'src/entity/banner.entity';

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
      .where(`b.status = :status AND b.startAt < NOW() AND b.endAt > NOW()`, { status: BANNER_STATUS.ACTIVE })
      .orderBy('b.order', 'ASC')
      .getRawMany<BannerEntity>();
  }
}
