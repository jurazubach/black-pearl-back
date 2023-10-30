import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchDto } from './search.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Search products by text' })
  @HttpCode(HttpStatus.OK)
  async searchByText(@Body() payload: SearchDto) {
    const products = await this.searchService.searchByText(payload.text);

    return { data: products };
  }
}
