import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsArrayOfObjects } from 'src/decorators/isArrayObject.decorators';
import { EOrderPayment, EOrderPaymentType, EOrderPostType, EOrderType } from 'src/entity/order.entity';
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
  @ApiProperty({ example: '0997301529' })
  phone: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Kyiv' })
  city: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Kyiv region' })
  region: string;

  @IsIn(Object.values(EOrderPostType))
  @IsNotEmpty()
  @ApiProperty({ example: EOrderPostType.NOVA_POSHTA })
  postType: EOrderPostType;

  @IsNotEmpty()
  @ApiProperty({ example: 'Lomonosova 50/2' })
  postAddress: string;

  @IsIn(Object.values(EOrderPaymentType))
  @IsNotEmpty()
  @ApiProperty({ example: EOrderPaymentType.CASH })
  paymentType: EOrderPaymentType;

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
  @ApiProperty({ example: EOrderType.OPEN })
  @IsEnum(EOrderType, { each: true })
  type?: EOrderType;

  @IsOptional()
  @ApiProperty({ example: EOrderPayment.UN_PAID })
  @IsEnum(EOrderPayment, { each: true })
  payment?: EOrderPayment;
}
