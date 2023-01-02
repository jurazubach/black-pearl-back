import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';
import { CouponDto } from './coupon.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { I18nLang } from 'nestjs-i18n';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Возвращает список купонов' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getCouponList(@Pagination() pagination: IPagination) {
    const coupons = await this.couponService.getCouponList(pagination);

    return { data: coupons };
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID клиента', example: '1' })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретному купону' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getCustomer(@Param('id') id: number) {
    const coupon = await this.couponService.getCouponByParams({ id });

    return { data: coupon };
  }

  @Get(':id/orders')
  @ApiParam({ name: 'id', required: true, description: 'ID клиента', example: '1' })
  @ApiOperation({ summary: 'Возвращает список заказов по конкретному купону' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getCustomerOrders(
    @Param('id') id: number,
    @Pagination() pagination: IPagination,
    @I18nLang() lang: string,
  ) {
    const coupon = await this.couponService.getCouponByParams({ id });
    const orders = await this.couponService.getCouponOrders(coupon, pagination, lang);

    return { data: orders };
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового клиента' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async createCoupon(@Body() payload: CouponDto) {
    const coupon = await this.couponService.createCoupon(payload);

    return { data: coupon };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление конкретного купона' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async deleteCustomer(@Param('id') id: number) {
    const couponEntity = await this.couponService.getCouponByParams({ id });
    await this.couponService.deleteCoupon(couponEntity);

    return { data: { status: true } };
  }
}
