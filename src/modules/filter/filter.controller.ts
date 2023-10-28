import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  async getFilters() {
    const filterModels = await this.filterService.getList();

    return { data: filterModels };
  }

  @Get('list/category/:alias')
  @ApiParam({
    name: 'alias',
    required: true,
    description: 'Алиас категории',
    example: 'hoodies',
  })
  @ApiOperation({ summary: 'Return filters dictionary' })
  @HttpCode(HttpStatus.OK)
  async getCategoryFilters(@Param('alias') alias: string) {
    const filterModels = await this.filterService.getCategoryFilters(alias);

    return { data: filterModels };
  }
}
