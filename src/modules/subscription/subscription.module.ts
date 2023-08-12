import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../../entity/subscription.entity';

@Module({
  controllers: [SubscriptionController],
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    MailModule
  ],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
