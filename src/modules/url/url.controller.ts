import { Controller, Get, HttpCode, HttpStatus, Param, Redirect } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UrlService } from './url.service';

@ApiTags('Url')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('s/:hash')
  @ApiOperation({
    summary: 'Декодирует hash и делает редирект по сохранённому URL',
  })
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @Redirect()
  async checkAndRedirect(@Param('hash') hash: string) {
    const url = await this.urlService.decodeHash(hash);

    // TODO: тут сохранять и делать разную аналитику, авторизован юзер был
    // или не авторизован и всё что с этим посещение надо
    // удалять ли линку после того как он её открыл уже
    await this.urlService.upLinkReview(hash);

    return { url, statusCode: HttpStatus.PERMANENT_REDIRECT };
  }
}
