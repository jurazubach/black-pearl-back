import { Controller, Post, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { Auth } from '../../decorators/auth.decorators';
import { IJwtToken } from './auth.interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() payload: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.getUserByParams({
      email: payload.email,
    });

    if (!this.authService.isPasswordValid(payload.password, user)) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    const token = this.authService.generateJwt({ user });

    this.authService.setJwtToCookie(token, res);

    return { data: token };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Убрать авторизацию юзера' })
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async logout(@Auth() auth: IJwtToken, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.getUserByParams({
      email: auth.email,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.authService.deleteJwtFromCookie(res);

    return { data: { success: true } };
  }
}
