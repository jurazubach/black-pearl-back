import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendFeedbackDTO } from './feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Save feedback from customer' })
  @HttpCode(HttpStatus.CREATED)
  async sendFeedback(@Body() payload: SendFeedbackDTO) {
    await this.feedbackService.createFeedback({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
    });

    return { data: { success: true } };
  }
}
