import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'test search' })
  text: string;
}

