import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { I18nLang } from 'nestjs-i18n';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Возвращает список заказов' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getOrderList(@Pagination() pagination: IPagination, @I18nLang() lang: string) {
    const orders = await this.orderService.getOrderList(pagination, lang);

    return { data: orders };
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID клиента', example: '1' })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретному заказу' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getOrder(@Param('id') id: number, @I18nLang() lang: string) {
    const order = await this.orderService.getOrderByParams({ id }, lang);

    return { data: order };
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового заказа' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() payload: CreateOrderDto, @I18nLang() lang: string) {
    const order = await this.orderService.createOrder(payload, lang);

    return { data: order };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление данных конкретного заказа' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async updateOrder(@Param('id') id: number, @Body() payload: UpdateOrderDto) {
    await this.orderService.updateOrder(id, payload);

    return { data: { status: true } };
  }
}