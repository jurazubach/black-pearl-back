import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ESortPage } from 'src/constants/sorting';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Get('home/popular')
  @ApiOperation({ summary: 'Return product for home page by popular sorting' })
  @HttpCode(HttpStatus.OK)
  async getPopularProducts() {
    const products = await this.productService.getHomeProducts(ESortPage.POPULAR);

    return { data: products };
  }

  @Get('home/novelty')
  @ApiOperation({ summary: 'Return product for home page by novelty sorting' })
  @HttpCode(HttpStatus.OK)
  async getNoveltyProducts() {
    const products = await this.productService.getHomeProducts(ESortPage.NOVELTY);

    return { data: products };
  }

  @Get('similar/:alias')
  @ApiParam({ name: 'alias', required: true, description: 'Product alias', example: 'hoodie_first' })
  @ApiOperation({ summary: 'Return similar product list by product alias' })
  @HttpCode(HttpStatus.OK)
  async getSimilarProducts(@Param('alias') alias: string) {
    const product = await this.productService.getPureProduct({ alias });
    const products = await this.productService.getSimilarProducts(product.id);

    return { data: products };
  }

  @Get('complete-the-look/:alias')
  @ApiParam({ name: 'alias', required: true, description: 'Product alias', example: 'hoodie_first' })
  @ApiOperation({ summary: 'Return product in complete look' })
  @HttpCode(HttpStatus.OK)
  async getCompleteTheLook(@Param('alias') alias: string) {
    const product = await this.productService.getPureProduct({ alias });
    const look = await this.productService.getLookByProductId(product.id);
    const lookProducts = await this.productService.getLookProducts(look.id);

    return { data: { look, products: lookProducts } };
  }

  @Get(':alias')
  @ApiParam({ name: 'alias', required: true, description: 'Product', example: 'hoodie_first' })
  @ApiOperation({ summary: 'Return full information about product' })
  @HttpCode(HttpStatus.OK)
  async getProductByAlias(@Param('alias') alias: string) {
    const product = await this.productService.getProduct(alias);

    return { data: product };
  }
}
