import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CATEGORY_STATUS, CategoryEntity } from 'src/entity/category.entity';
import { IPagination } from 'src/decorators/pagination.decorators';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
  }

  async getCategory(alias: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.alias = :alias AND c.status = :status', { alias, status: CATEGORY_STATUS.ACTIVE })
      .select(`c.id, c.alias, c.singleTitle, c.description`)
      .getRawOne<CategoryEntity>();

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async getCategoryList(pagination: IPagination): Promise<CategoryEntity[]> {
    return this.categoryRepository
      .createQueryBuilder('c')
      .limit(pagination.limit)
      .where('c.status = :status', { status: CATEGORY_STATUS.ACTIVE })
      .offset(pagination.offset)
      .select(`c.id, c.alias, c.title, c.description`)
      .getRawMany<CategoryEntity>();
  }
}
