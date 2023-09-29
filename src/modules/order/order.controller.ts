import { Controller, Get, Post, HttpCode, HttpStatus, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new order by customer' })
  @ApiBearerAuth('token')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() payload: CreateOrderDto) {
    // const order = await this.orderService.createOrder(payload);

    return { data: {} };
  }

  @Get(':code')
  @ApiParam({ name: 'code', required: true, description: 'Order number', example: '123456' })
  @ApiOperation({ summary: 'Return full information by order code' })
  @HttpCode(HttpStatus.OK)
  async getOrderByCode(@Param('code') code: string) {
    return { data: [] };
  }
}
