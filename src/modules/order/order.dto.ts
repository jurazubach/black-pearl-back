import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsArrayOfObjects } from 'src/decorators/isArrayObject.decorators';
import { ORDER_PAYMENT, ORDER_TYPE } from 'src/entity/order.entity';
import { TWarehouseProductSize, WAREHOUSE_PRODUCT_SIZE } from 'src/entity/warehouseProduct.entity';

export class OrderProductDto {
  @IsNotEmpty()
  @ApiProperty({ example: 2515 })
  productId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  quantity: number;

  @IsNotEmpty()
  @ApiProperty({ example: 1200 })
  price: number;

  @IsIn(Object.values(WAREHOUSE_PRODUCT_SIZE))
  @IsOptional()
  @ApiProperty({ example: WAREHOUSE_PRODUCT_SIZE.S })
  size: TWarehouseProductSize;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Admin' })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Adminovich' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Kyiv' })
  city: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Kyiv region' })
  region: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Lomonosova 50/2' })
  address: string;

  @IsNotEmpty()
  @ApiProperty({ example: '26' })
  flat: string;

  @IsNotEmpty()
  @ApiProperty({ example: '0997301529' })
  phone: string;

  @IsOptional()
  @ApiProperty({ example: 'HAPPY_NEW_YEAR' })
  couponCode?: string;

  @IsOptional()
  @ApiProperty({ example: 0 })
  approved?: number;

  @IsArrayOfObjects()
  @Type(() => OrderProductDto)
  @ValidateNested()
  orderProducts: OrderProductDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @ApiProperty({ example: 'Admin' })
  firstName?: string;

  @IsOptional()
  @ApiProperty({ example: 'Adminovich' })
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @IsOptional()
  @ApiProperty({ example: 'Kyiv' })
  city?: string;

  @IsOptional()
  @ApiProperty({ example: 'Kyiv region' })
  region?: string;

  @IsOptional()
  @ApiProperty({ example: 'Lomonosova 50/2' })
  address?: string;

  @IsOptional()
  @ApiProperty({ example: '26' })
  flat?: string;

  @IsOptional()
  @ApiProperty({ example: '0997301529' })
  phone?: string;

  @IsOptional()
  @ApiProperty({ example: 0 })
  approved?: number;

  @IsOptional()
  @ApiProperty({ example: ORDER_TYPE.OPEN })
  @IsEnum(ORDER_TYPE, { each: true })
  type?: ORDER_TYPE;

  @IsOptional()
  @ApiProperty({ example: ORDER_PAYMENT.UN_PAID })
  @IsEnum(ORDER_PAYMENT, { each: true })
  payment?: ORDER_PAYMENT;
}
