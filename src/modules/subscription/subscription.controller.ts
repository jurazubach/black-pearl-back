import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from 'src/modules/mail/mail.service';
import { SubscriptionDiscountDTO } from './subscription.dto';
import { SubscriptionService } from './subscription.service';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly mailService: MailService,
  ) {}

  @Post('discount')
  @ApiOperation({ summary: 'Подписаться на рассылку и получить скидку' })
  @HttpCode(HttpStatus.CREATED)
  async discountSubscription(@Body() payload: SubscriptionDiscountDTO) {
    const isUserExist = await this.subscriptionService.isUserExistByParams({ email: payload.email });
    if (isUserExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const subscription = await this.subscriptionService.createSubscription({ email: payload.email });

    // TODO: тут код взять гдето
    // await this.mailService.sendUserSubscriptionDiscount(subscription, 'NEW_YEAR');

    return { data: { success: true } };
  }
}
