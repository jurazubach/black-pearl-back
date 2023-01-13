import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';
import { CouponDto } from './coupon.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

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
  async getCustomerOrders(@Param('id') id: number, @Pagination() pagination: IPagination) {
    const coupon = await this.couponService.getCouponByParams({ id });
    const orders = await this.couponService.getCouponOrders(coupon, pagination);

    return { data: orders };
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового купона' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async createCoupon(@Body() payload: CouponDto) {
    const coupon = await this.couponService.createCoupon(payload);

    return { data: coupon };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление данные конкретного купона' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async updateCoupon(@Param('id') id: number, @Body() payload: CouponDto) {
    await this.couponService.updateCoupon(id, payload);

    return { data: { status: true } };
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
