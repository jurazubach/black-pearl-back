import {
  Controller,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  HttpException,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import pick from "lodash/pick";
import { UserService } from "./user.service";
import { Auth } from "../../decorators/auth.decorators";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ChangePasswordDTO, PutUserDTO } from "./user.dto";
import { AuthService } from "../auth/auth.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IJwtToken } from "../auth/auth.interfaces";
import { MailService } from "../mail/mail.service";
import { Response } from "express";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService
  ) {}

  @Get("me")
  @ApiOperation({ summary: "Получение данных пользователя" })
  @ApiBearerAuth("token")
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getMe(@Auth() auth: IJwtToken) {
    const user = await this.userService.getSecureUserByParams({
      email: auth.email,
    });

    return { data: user };
  }

  @Put("me")
  @ApiOperation({ summary: "Обновление данных пользователя" })
  @ApiBearerAuth("token")
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async putMe(@Body() payload: PutUserDTO, @Auth() auth: IJwtToken) {
    const user = await this.userService.getSecureUserByParams({
      email: auth.email,
    });

    Object.assign(user, payload);
    await this.userService.updateUser(
      user.id,
      pick(user, ["firstName", "lastName", "lang"])
    );

    return { data: user };
  }

  @Put("change-password")
  @ApiOperation({ summary: "Смена пароля пользователя" })
  @ApiBearerAuth("token")
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async putChangePassword(
    @Body() payload: ChangePasswordDTO,
    @Auth() auth: IJwtToken
  ) {
    const user = await this.userService.getUserByParams({
      email: auth.email,
    });

    if (!this.authService.isPasswordValid(payload.currentPassword, user)) {
      throw new HttpException("Incorrect password", HttpStatus.FORBIDDEN);
    }

    const generatedSalt = this.authService.generateRandomSalt();
    const hashedPassword = this.authService.generatePasswordHash(
      payload.password,
      generatedSalt
    );

    await this.userService.updateUser(user.id, {
      salt: generatedSalt,
      password: hashedPassword,
    });

    return { data: { status: "success" } };
  }

  @Delete("account")
  @AuthGuard()
  @ApiOperation({ summary: "Безвозвратное полное удаление пользователя" })
  @ApiBearerAuth("token")
  @HttpCode(HttpStatus.OK)
  async deleteMe(
    @Auth() auth: IJwtToken,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.userService.getSecureUserByParams({
      email: auth.email,
    });

    await this.userService.deleteUser(user);

    const cookieName = this.configService.get("JWT_COOKIE_NAME");
    res.clearCookie(cookieName, {
      domain: this.configService.get("COOKIE_DOMAIN"),
      path: this.configService.get("COOKIE_PATH"),
      sameSite: "none",
      secure: true,
      httpOnly: false,
    });

    return { data: { success: "true" } };
  }
}
