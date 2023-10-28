import { EntityManager } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IFilters } from 'src/decorators/filters.decorators';
import { LISTEN_FILTERS } from 'src/constants/filters';
import { CategoryEntity } from 'src/entity/category.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { WAREHOUSE_PRODUCT_SIZE } from 'src/entity/warehouseProduct.entity';
import { IFilterCategory, IFilterModels, IFilterProperty, IFilterSize } from './filter.types';

const ONE_HOUR = 60000 * 60;

@Injectable()
export class FilterService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER)
    private cacheManager: CacheStore,
  ) {
  }

  public async getCategoryFilters(alias: string): Promise<IFilterModels> {
    const filterModels: IFilterModels = {
      categories: [],
      sizes: [],
      properties: [],
    };

    for await (let filterKey of Object.values(LISTEN_FILTERS)) {
      if (filterKey === LISTEN_FILTERS.SIZE) {
        filterModels.sizes = await this.getSizesModels();
      } else {
        const filterPropertyModel = await this.getPropertyModels(filterKey);
        if (filterPropertyModel) {
          filterModels.properties.push(filterPropertyModel)
        }
      }
    }

    return filterModels;
  }

  public async getList(): Promise<IFilterModels> {
    const filterModels: IFilterModels = {
      categories: [],
      sizes: [],
      properties: [],
    };

    for await (let filterKey of Object.values(LISTEN_FILTERS)) {
      if (filterKey === LISTEN_FILTERS.CATEGORIES) {
        filterModels.categories = await this.getCategoriesModels();
      } else if (filterKey === LISTEN_FILTERS.SIZE) {
        filterModels.sizes = await this.getSizesModels();
      } else {
        const filterPropertyModel = await this.getPropertyModels(filterKey);
        if (filterPropertyModel) {
          filterModels.properties.push(filterPropertyModel)
        }
      }
    }

    return filterModels;
  }

  private async getCategoriesModels() {
    const categoriesFromCache = await this.cacheManager.get(`filter.${LISTEN_FILTERS.CATEGORIES}`) as IFilterCategory[];
    if (Array.isArray(categoriesFromCache)) {
      return categoriesFromCache;
    }

    const categories = await this.entityManager
      .createQueryBuilder(CategoryEntity, 'c')
      .select('c.id, c.alias, c.singleTitle AS title')
      .getRawMany<IFilterCategory>();

    this.cacheManager.set(`filter.${LISTEN_FILTERS.CATEGORIES}`, categories, { ttl: ONE_HOUR });

    return categories;
  }

  private async getPropertyModels(propertyAlias: string) {
    let filterPropertyModel = await this.cacheManager.get(`filter.${propertyAlias}`) as IFilterProperty;
    if (filterPropertyModel) {
      return filterPropertyModel;
    }

    const properties = await this.entityManager
      .createQueryBuilder(PropertyEntity, 'p')
      .select('p.id, p.alias, p.title')
      .getRawMany<PropertyEntity>();

    const propertyValues = await this.entityManager
      .createQueryBuilder(PropertyValueEntity, 'pv')
      .select('pv.id, pv.propertyId, pv.alias, pv.title')
      .getRawMany<PropertyValueEntity>();

    properties.forEach((property) => {
      const filteredPropertyValues = propertyValues.filter((i) => i.propertyId === property.id);
      const propertyModel = { id: property.id, alias: property.alias, title: property.title, children: filteredPropertyValues };

      this.cacheManager.set(`filter.${property.alias}`, propertyModel, { ttl: ONE_HOUR });
      filterPropertyModel = propertyModel;
    });

    return filterPropertyModel;
  }

  private async getSizesModels() {
    const sizesFromCache = await this.cacheManager.get(`filter.${LISTEN_FILTERS.SIZE}`) as IFilterSize[];
    if (Array.isArray(sizesFromCache)) {
      return sizesFromCache;
    }

    const sizes: IFilterSize[] = Object.values(WAREHOUSE_PRODUCT_SIZE).map((size) => ({ alias: size, title: size }));
    this.cacheManager.set(`filter.${LISTEN_FILTERS.SIZE}`, sizes, { ttl: ONE_HOUR });

    return sizes;
  }

  public async getFilterModels(filters: IFilters): Promise<IFilterModels> {
    const filterModels: IFilterModels = {
      categories: [],
      sizes: [],
      properties: [],
    };

    for await (let [filterKey, filterValues] of Object.entries(filters)) {
      if (filterKey === LISTEN_FILTERS.CATEGORIES) {
        const categoriesModels = await this.getCategoriesModels();
        const filteredCategories = categoriesModels.filter((i) => filterValues.includes(i.alias));

        if (filteredCategories.length > 0) {
          filterModels.categories = filteredCategories;
        }
      } else if (filterKey === LISTEN_FILTERS.SIZE) {
        const sizesModels = await this.getSizesModels();
        const filteredSizes = sizesModels.filter((i) => filterValues.includes(i.alias));

        if (filteredSizes.length > 0) {
          filterModels.sizes = filteredSizes;
        }
      } else {
        const filterPropertyModel = await this.getPropertyModels(filterKey);

        if (filterPropertyModel) {
          const filteredChildrenPropertyValues = filterPropertyModel.children.filter((i) => {
            return filterValues.includes(i.alias);
          });

          filterModels.properties.push({
            ...filterPropertyModel,
            children: filteredChildrenPropertyValues,
          });
        }
      }
    }

    return filterModels;
  }
}
