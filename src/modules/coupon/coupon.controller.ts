import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';

@ApiTags('Coupons')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('check/:code')
  @ApiParam({ name: 'code', required: true, description: 'Coupon code', example: 'NEW_YEAR' })
  @ApiOperation({ summary: 'Return full information about coupon code' })
  @HttpCode(HttpStatus.OK)
  async getCouponByCode(@Param('code') code: string) {
    const couponInfo = await this.couponService.getCouponAvailableInfo(code);

    return { data: couponInfo };
  }
}
