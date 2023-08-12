import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IPagination, Pagination } from 'src/decorators/pagination.decorators';
import { PromotionService } from './promotion.service';

@ApiTags('Promotions')
@Controller('promotion')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Return list of promotions with pagination' })
  @HttpCode(HttpStatus.OK)
  async getPromotionList(@Pagination() pagination: IPagination) {
    const promotions = await this.promotionService.getPromotionList(pagination);

    return { data: promotions };
  }

  @Get('home')
  @ApiOperation({ summary: 'Return list of promotions for home page' })
  @HttpCode(HttpStatus.OK)
  async getHomePromotionList() {
    const promotions = await this.promotionService.getHomePromotionList();

    return { data: promotions };
  }

  @Get(':alias')
  @ApiParam({ name: 'alias', required: true, description: 'Promotion alias', example: 'new_year' })
  @ApiOperation({ summary: 'Return promotion with products' })
  @HttpCode(HttpStatus.OK)
  async getPromotion(@Param('alias') alias: string) {
    const promotion = await this.promotionService.getPromotion(alias);
    const promotionProducts = await this.promotionService.getPromotionProducts(promotion.id);

    return { data: promotion, products: promotionProducts };
  }
}
