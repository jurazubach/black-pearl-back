import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from 'src/entity/subscription.entity';

@Module({
  controllers: [SubscriptionController],
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
  ],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
