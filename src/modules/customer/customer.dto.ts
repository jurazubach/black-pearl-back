import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CustomerDTO {
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
}
