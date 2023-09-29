import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;
}

export class RegisterDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'Ivan' })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Ivanov' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'ivan@gmail.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;
}

export class RecoverPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@test.com' })
  email: string;
}

export class ConfirmRecoverPasswordDTO {
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'token' })
  token: string;
}
