import { Module } from '@nestjs/common';
import { FeedbackEntity } from 'src/entity/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  controllers: [FeedbackController],
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity]),
  ],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
