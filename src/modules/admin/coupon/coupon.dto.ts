import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Max, Min, IsNumber } from 'class-validator';
import { ECouponDiscountType, ECouponType } from 'src/entity/coupon.entity';

export class CouponDto {
  @IsNotEmpty()
  @ApiProperty({ example: ECouponType.SINGLE })
  @IsEnum(ECouponType, { each: true })
  type: ECouponType;

  @IsOptional()
  @ApiProperty({ example: 'HAPPY_NEW_YEAR' })
  code?: string;

  @IsNotEmpty()
  @ApiProperty({ example: ECouponDiscountType.PERCENT })
  @IsEnum(ECouponDiscountType, { each: true })
  discountType: ECouponDiscountType;

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
