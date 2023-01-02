import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsArrayOfObjects } from "src/decorators/isArrayObject.decorators";
import { ORDER_PAYMENT, ORDER_TYPE } from '../../entity/order.entity';

export class OrderProductPropertyDto {
  @IsNotEmpty()
  @ApiProperty({ example: 2515 })
  propertyId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 2515 })
  propertyValueId: number;
}

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

  @IsArrayOfObjects()
  @Type(() => OrderProductPropertyDto)
  @ValidateNested()
  productProperties: OrderProductPropertyDto[];
}

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty({ example: "Admin" })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: "Adminovich" })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "test@test.com" })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: "Kyiv" })
  city: string;

  @IsNotEmpty()
  @ApiProperty({ example: "Kyiv region" })
  region: string;

  @IsNotEmpty()
  @ApiProperty({ example: "Lomonosova 50/2" })
  address: string;

  @IsNotEmpty()
  @ApiProperty({ example: "26" })
  flat: string;

  @IsNotEmpty()
  @ApiProperty({ example: "0997301529" })
  phone: string;

  @IsOptional()
  @ApiProperty({ example: "HAPPY_NEW_YEAR" })
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
  @ApiProperty({ example: "Admin" })
  firstName?: string;

  @IsOptional()
  @ApiProperty({ example: "Adminovich" })
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: "test@test.com" })
  email: string;

  @IsOptional()
  @ApiProperty({ example: "Kyiv" })
  city?: string;

  @IsOptional()
  @ApiProperty({ example: "Kyiv region" })
  region?: string;

  @IsOptional()
  @ApiProperty({ example: "Lomonosova 50/2" })
  address?: string;

  @IsOptional()
  @ApiProperty({ example: "26" })
  flat?: string;

  @IsOptional()
  @ApiProperty({ example: "0997301529" })
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
