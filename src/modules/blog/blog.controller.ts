import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/constants/pagination';
import { IPagination, Pagination } from 'src/decorators/pagination.decorators';
import { BlogService } from './blog.service';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'Return blog articles by filters' })
  @HttpCode(HttpStatus.OK)
  async getArticleList(@Pagination() pagination: IPagination) {
    const articleList = await this.blogService.getArticleList(pagination);

    return { data: articleList };
  }

  @Get('home/latest')
  @ApiOperation({ summary: 'Return blog latest articles' })
  @HttpCode(HttpStatus.OK)
  async getArticleLatest() {
    const articleList = await this.blogService.getArticleList({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      limit: 5,
      offset: 0
    });

    return { data: articleList };
  }

  @Get('article/:alias')
  @ApiParam({ name: 'alias', required: true, description: 'Article alias', example: 'new_year' })
  @ApiOperation({ summary: 'Return full info about article' })
  @HttpCode(HttpStatus.OK)
  async getArticle(@Param('alias') alias: string) {
    const article = await this.blogService.getArticle(alias);

    return { data: article };
  }
}
