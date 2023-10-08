import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SOCIAL_TYPE, SocialEntity } from 'src/entity/social.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialEntity)
    private readonly socialEntityRepository: Repository<SocialEntity>,
  ) {
  }

  async getInstagramPostList() {
    return this.socialEntityRepository
      .createQueryBuilder('s')
      .select(
        `
        s.id,
        s.imageSrc,
        s.description,
        s.link
        `,
      )
      .where(`s.type = :type`, { type: SOCIAL_TYPE.INSTAGRAM })
      .orderBy('s.order', 'ASC')
      .limit(10)
      .getRawMany<SocialEntity>();
  }
}
