import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Max, Min, IsNumber } from 'class-validator';
import { COUPON_DISCOUNT_TYPE, COUPON_TYPE } from '../../entity/coupon.entity';

export class CouponDto {
  @IsNotEmpty()
  @ApiProperty({ example: COUPON_TYPE.SINGLE })
  @IsEnum(COUPON_TYPE, { each: true })
  type: COUPON_TYPE;

  @IsOptional()
  @ApiProperty({ example: 'HAPPY_NEW_YEAR' })
  code?: string;

  @IsNotEmpty()
  @ApiProperty({ example: COUPON_DISCOUNT_TYPE.PERCENT })
  @IsEnum(COUPON_DISCOUNT_TYPE, { each: true })
  discountType: COUPON_DISCOUNT_TYPE;

  @IsOptional()
  @ApiProperty({ example: 100 })
  @Min(1)
  @IsNumber()
  discount?: number;

  @IsNotEmpty()
  @ApiProperty({ example: '2015-05-20 16:05:00' })
  startAt: string;

  @IsNotEmpty()
  @ApiProperty({ example: '2015-05-20 16:05:00' })
  endAt: string;
}
