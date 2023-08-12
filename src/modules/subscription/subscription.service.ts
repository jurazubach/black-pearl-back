import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionEntity } from '../../entity/promotion.entity';
import { SubscriptionEntity } from '../../entity/subscription.entity';
import { SubscriptionDiscountDTO } from './subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionEntity: Repository<PromotionEntity>,
  ) {
  }

  async isUserExistByParams(where: { [key: string]: any }) {
    const subscription = await this.subscriptionEntity
      .createQueryBuilder('s')
      .select(
        `
        s.id,
        s.email
        `,
      )
      .where(`s.email = :email`, where)
      .getRawOne<SubscriptionEntity>();

    return !!subscription;
  }

  async createSubscription(payload: SubscriptionDiscountDTO) {
    const subscriptionEntity = new SubscriptionEntity();
    Object.assign(subscriptionEntity, { email: payload.email });

    return this.subscriptionEntity.save(subscriptionEntity);
  }
}
