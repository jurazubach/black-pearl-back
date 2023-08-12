import { Controller, Get, Post, HttpCode, HttpStatus, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../admin/order/order.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создание нового заказа' })
  @ApiBearerAuth('token')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() payload: CreateOrderDto) {
    // const order = await this.orderService.createOrder(payload);

    return { data: {} };
  }

  @Get(':code')
  @ApiParam({ name: 'code', required: true, description: 'Номер заказа', example: '123456' })
  @ApiOperation({ summary: 'Возвращает заказ и подробную информацию по продуктах' })
  @HttpCode(HttpStatus.OK)
  async getOrderByCode(@Param('code') code: string) {
    return { data: [] };
  }
}
