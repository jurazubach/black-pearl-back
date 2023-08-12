import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialService } from './social.service';

@ApiTags('Socials')
@Controller('social')
export class SocialController {
  constructor(
    private readonly socialService: SocialService
  ) {}

  @Get('home/instagram')
  @ApiOperation({ summary: 'Return instagram posts for home page' })
  @HttpCode(HttpStatus.OK)
  async getHomeInstagramPostList() {
    const posts = await this.socialService.getInstagramPostList();

    return { data: posts };
  }
}
