import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { IPagination, Pagination } from 'src/decorators/pagination.decorators';
import { CustomerDTO } from './customer.dto';
import { CustomerEntity } from 'src/entity/customer.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Admin Customers')
@Controller('')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Возвращает список клиентов' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getCollectionList(@Pagination() pagination: IPagination) {
    const customers = await this.customerService.getCustomerList(pagination);

    return { data: customers };
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID клиента', example: '1' })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретному клиенту' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getCustomer(@Param('id') id: number) {
    const customer = await this.customerService.getCustomerByParams({ id });

    return { data: customer };
  }

  @Get(':id/orders')
  @ApiParam({ name: 'id', required: true, description: 'ID клиента', example: '1' })
  @ApiOperation({ summary: 'Возвращает список заказов по конкретному клиенту' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getCustomerOrders(@Param('id') id: number, @Pagination() pagination: IPagination) {
    const customer = await this.customerService.getCustomerByParams({ id }, 'c.id, c.email');
    const customerOrders = await this.customerService.getCustomerOrders(customer, pagination);

    return { data: customerOrders };
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового клиента' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async createCustomer(@Body() payload: CustomerDTO) {
    const isCustomerExist = await this.customerService.isCustomerExistByParams({ email: payload.email });
    if (isCustomerExist) throw new HttpException('Customer already exist', HttpStatus.BAD_REQUEST);

    const customerEntity = new CustomerEntity();
    Object.assign(customerEntity, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      city: payload.city,
      region: payload.region,
      phone: payload.phone,
    });
    const customer = await this.customerService.createCustomer(customerEntity);

    return { data: customer };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление данные конкретного клиента' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async updateCustomer(@Param('id') id: number, @Body() payload: CustomerDTO) {
    const customerEntity = await this.customerService.getCustomerByParams({ id });
    Object.assign(customerEntity, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      city: payload.city,
      region: payload.region,
      phone: payload.phone,
    });

    await this.customerService.updateCustomer(id, customerEntity);

    return { data: { status: true } };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление конкретного клиента' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async deleteCustomer(@Param('id') id: number) {
    await this.customerService.deleteCustomerById(id);

    return { data: { status: true } };
  }
}
