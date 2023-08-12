import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BannerService } from './banner.service';

@ApiTags('Banner')
@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService
  ) {}

  @Get('home')
  @ApiOperation({ summary: 'Return list of banners for home page' })
  @HttpCode(HttpStatus.OK)
  async getHomePromotionList() {
    const banners = await this.bannerService.getBannerList();

    return { data: banners };
  }
}
