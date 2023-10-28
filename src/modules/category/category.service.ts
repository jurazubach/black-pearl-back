import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _sortBy from 'lodash/sortBy';
import { CATEGORY_STATUS, CategoryEntity } from 'src/entity/category.entity';
import { PRODUCT_STATUS, ProductEntity } from 'src/entity/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
  }

  async getMenu() {
    const categories = await this.categoryRepository
      .createQueryBuilder('c')
      .select(`c.alias, c.multipleTitle`)
      .innerJoin(ProductEntity, 'p', 'p.categoryId = c.id AND p.status = :productStatus', { productStatus: PRODUCT_STATUS.ACTIVE })
      .where('c.status = :status', { status: CATEGORY_STATUS.ACTIVE })
      .groupBy('c.alias, c.multipleTitle')
      .orderBy('c.multipleTitle')
      .getRawMany<CategoryEntity>();

    const sortedCategories = _sortBy(categories, 'c.multipleTitle');

    return sortedCategories.map((categoryEntity) => ({ alias: categoryEntity.alias, title: categoryEntity.multipleTitle }));
  }

  async getCategory(alias: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.alias = :alias AND c.status = :status', { alias, status: CATEGORY_STATUS.ACTIVE })
      .select(`c.id, c.alias, c.singleTitle, c.multipleTitle, c.description`)
      .getRawOne<CategoryEntity>();

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }
}
