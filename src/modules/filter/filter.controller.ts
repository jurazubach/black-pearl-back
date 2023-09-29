import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterService } from './filter.service';

@ApiTags('Filter')
@Controller('filter')
export class FilterController {
  constructor(
    private readonly filterService: FilterService,
    ) {}

  @Get('list')
  @ApiOperation({ summary: 'Return filters dictionary' })
  @HttpCode(HttpStatus.OK)
  async getMetaTags() {
    const filterModels = await this.filterService.getList();

    return { data: filterModels };
  }
}
