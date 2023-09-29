import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SendFeedbackDTO {
  @MinLength(3)
  @MaxLength(250)
  @ApiProperty({ example: 'Ivan' })
  firstName: string;

  @MinLength(3)
  @MaxLength(250)
  @ApiProperty({ example: 'Ivanov' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(250)
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @MinLength(9)
  @MaxLength(12)
  @ApiProperty({ example: '0997700111' })
  phone: string;

  @MinLength(10)
  @MaxLength(250)
  @ApiProperty({ example: 'Hello' })
  subject: string;

  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty({ example: 'Message text' })
  message: string;
}
