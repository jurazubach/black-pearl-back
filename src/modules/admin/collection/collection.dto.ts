import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CollectionDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'nezhaleshna' })
  alias: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Nezhaleshna' })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Nezhaleshna description' })
  description: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.com' })
  isActive: number;

  @IsNotEmpty()
  @ApiProperty({ example: '1,2,3,4,5' })
  productIds: string
}
