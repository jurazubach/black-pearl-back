import { Controller, Post, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserEntity, USER_ROLE } from 'src/entity/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AUTHORIZATION_TYPE } from 'src/entity/authorization.entity';
import { MailService } from '../../mail/mail.service';
import { UrlService } from '../../url/url.service';

@ApiTags('Admin Auth')
@Controller('')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly urlService: UrlService,
  ) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() payload: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.getUserByParams({
      email: payload.email,
    });

    if (!user.isActive) {
      throw new HttpException('User is deactivated', HttpStatus.FORBIDDEN);
    }

    if (!this.authService.isPasswordValid(payload.password, user)) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    const token = await this.authService.generateJwt({ user });

    this.authService.setJwtToCookie(token, res);

    return { data: token };
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() payload: RegisterDTO) {
    const isUserExist = await this.userService.isUserExistByParams({
      email: payload.email,
    });
    if (isUserExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const generatedSalt = this.authService.generateRandomSalt();
    const hashedPassword = this.authService.generatePasswordHash(payload.password, generatedSalt);

    const userEntity = new UserEntity();
    Object.assign(userEntity, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
      salt: generatedSalt,
      lang: payload.lang,
      role: USER_ROLE.USER,
      isActive: true,
    });

    const user = await this.userService.createUser(userEntity);

    const confirmEmailToken = await this.userService.setAuthToken({
      user,
      type: AUTHORIZATION_TYPE.CONFIRM_EMAIL,
    });
    await this.mailService.sendUserConfirmEmail(user, confirmEmailToken);

    return { data: { success: true } };
  }
}
