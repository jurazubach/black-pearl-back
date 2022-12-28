import { IsIn, IsNotEmpty, MinLength, IsOptional } from "class-validator";
import { USER_LANGUAGE } from "src/entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class PutUserDTO {
  @IsOptional()
  @MinLength(3)
  @ApiProperty({ example: "Ivan" })
  firstName: string;

  @IsOptional()
  @MinLength(3)
  @ApiProperty({ example: "Ivanov" })
  lastName: string;

  @IsIn([USER_LANGUAGE.UK, USER_LANGUAGE.EN])
  @IsOptional()
  @ApiProperty({ example: USER_LANGUAGE.UK })
  lang: string;
}

export class ChangePasswordDTO {
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: "111111" })
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: "123456" })
  currentPassword: string;
}
