import { Repository } from "typeorm";
import { I18nService } from "nestjs-i18n";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "../../entity/category.entity";
import { IPagination } from "../../decorators/pagination.decorators";
import { IFilterModels } from "../filter/filter.types";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly i18n: I18nService
  ) {}

  async getCategory(alias: string, lang: string) {
    const category = await this.categoryRepository
      .createQueryBuilder("c")
      .where("c.alias = :alias AND c.isActive = 1", { alias })
      .select(`c.id, c.alias`)
      .getRawOne<CategoryEntity>();

    if (!category) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
    }

    return this.fillCategoryTrans(category, lang);
  }

  async fillCategoryTrans(
    category: CategoryEntity,
    lang: string
  ): Promise<CategoryEntity> {
    const result = { ...category };
    const categoryTrans = await this.i18n.t(`categories.${category.alias}`, { lang });
    Object.assign(result, { ...categoryTrans });

    return result;
  }

  async getCategoryList(
    pagination: IPagination,
    filterModels: IFilterModels,
    lang: string
  ): Promise<CategoryEntity[]> {
    const criteria = this.categoryRepository
      .createQueryBuilder("c")
      .limit(pagination.limit)
      .where("c.isActive = 1")
      .offset(pagination.offset)
      .select(`c.id, c.alias`);
    const categories = await criteria.getRawMany<CategoryEntity>();

    return Promise.all(categories.map((c) => this.fillCategoryTrans(c, lang)));
  }

  async getCompaniesStat(category: CategoryEntity): Promise<[]> {
    return [];
  }
}
