import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';

@ApiTags('Collections')
@Controller('collections')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Возвращает список коллекций' })
  @HttpCode(HttpStatus.OK)
  async getCollectionList(
    @Pagination() pagination: IPagination,
    @I18nLang() lang: string) {
    const collections = await this.collectionService.getCollectionList(pagination, lang);

    return { data: collections };
  }

  @Get(':alias')
  @ApiParam({
    name: 'alias',
    required: true,
    description: 'Алиас товара',
    example: 'hoodie_first',
  })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретной коллекции' })
  @HttpCode(HttpStatus.OK)
  async getCollection(@Param('alias') alias: string, @I18nLang() lang: string) {
    const collection = await this.collectionService.getCollection(alias, lang);

    return { data: collection };
  }
}
