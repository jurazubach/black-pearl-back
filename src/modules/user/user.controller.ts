import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/decorators/auth.decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IJwtToken } from '../auth/auth.interfaces';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Получение данных пользователя' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async getMe(@Auth() auth: IJwtToken) {
    const user = await this.userService.getSecureUserByParams({
      email: auth.email,
    });

    return { data: user };
  }
}
