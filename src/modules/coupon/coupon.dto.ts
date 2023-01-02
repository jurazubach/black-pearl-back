import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, Max, Min, IsNumber } from "class-validator";
import { COUPON_TYPE } from '../../entity/coupon.entity';

export class CouponDto {
  @IsNotEmpty()
  @ApiProperty({ example: COUPON_TYPE.SINGLE })
  @IsEnum(COUPON_TYPE, { each: true })
  type: COUPON_TYPE;


  @IsOptional()
  @ApiProperty({ example: 'HAPPY_NEW_YEAR' })
  code?: string;

  @IsOptional()
  @ApiProperty({ example: 100 })
  @Min(1)
  @IsNumber()
  price?: number;

  @IsOptional()
  @ApiProperty({ example: 5 })
  @Min(1)
  @Max(100)
  percent?: number;

  @IsOptional()
  @ApiProperty({ example: 5 })
  customerId?: number;

  @IsNotEmpty()
  @ApiProperty({ example: "2015-05-20 16:05:00" })
  endAt: string;
}
