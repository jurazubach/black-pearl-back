import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from 'src/entity/feedback.entity';
import { SendFeedbackDTO } from './feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackEntityRepository: Repository<FeedbackEntity>,
  ) {
  }

  async createFeedback(payload: SendFeedbackDTO) {
    const feedbackEntity = new FeedbackEntity();
    Object.assign(feedbackEntity, payload);

    return this.feedbackEntityRepository.save(feedbackEntity);
  }
}
