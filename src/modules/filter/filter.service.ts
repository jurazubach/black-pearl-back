import { EntityManager } from 'typeorm';
import get from 'lodash/get';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IFilters } from 'src/decorators/filters.decorators';
import { LISTEN_FILTERS } from 'src/constants/filters';
import { CategoryEntity } from 'src/entity/category.entity';
import { IFilterState, IFilterModel, IFilterModels, IStateLangModels } from './filter.types';
import { PropertyEntity } from 'src/entity/property.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { CollectionEntity } from 'src/entity/collection.entity';

@Injectable()
export class FilterService {
  private state: IFilterState = {};

  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {
    this.loadState();
  }

  private async loadState() {
    const [categories, collections, properties, propertyValues] = await Promise.all([
      this.getCategories(),
      this.getCollections(),
      this.getProperties(),
      this.getPropertyValues(),
    ]);

    Object.assign(this.state, {
      [LISTEN_FILTERS.CATEGORIES]: categories,
      [LISTEN_FILTERS.COLLECTIONS]: collections,
      [LISTEN_FILTERS.PROPERTIES]: properties,
      [LISTEN_FILTERS.PROPERTY_VALUES]: propertyValues,
    });
  }

  private async getCategories() {
    const accumulator: IStateLangModels = { uk: [], en: [] };

    const categories = await this.entityManager
      .createQueryBuilder(CategoryEntity, 'c')
      .select('c.id, c.alias, c.singleTitle, c.description')
      .getRawMany<CategoryEntity>();

    for await (const category of categories) {
      accumulator.uk.push({ id: category.id, alias: category.alias, title: category.singleTitle, description: category.description });
    }

    return accumulator;
  }

  private async getCollections() {
    const accumulator: IStateLangModels = { uk: [], en: [] };

    const collections = await this.entityManager
      .createQueryBuilder(CollectionEntity, 'c')
      .select(`c.id, c.alias, c.title, c.description`)
      .getRawMany<CollectionEntity>();

    for await (const collection of collections) {
      accumulator.uk.push({ id: collection.id, alias: collection.alias, title: collection.title, description: collection.description });
    }

    return accumulator;
  }

  private async getProperties() {
    const accumulator: IStateLangModels = { uk: [], en: [] };

    const properties = await this.entityManager
      .createQueryBuilder(PropertyEntity, 'p')
      .select('p.id, p.alias, p.title')
      .getRawMany<PropertyEntity>();

    for await (const property of properties) {
      accumulator.uk.push({ id: property.id, alias: property.alias, title: property.title });
    }

    return accumulator;
  }

  private async getPropertyValues() {
    const accumulator: IStateLangModels = { uk: [], en: [] };

    const propertyValues = await this.entityManager
      .createQueryBuilder(PropertyValueEntity, 'pv')
      .select('pv.id, pv.alias, pv.title')
      .getRawMany<PropertyValueEntity>();

    for await (const propertyValue of propertyValues) {
      accumulator.uk.push({ id: propertyValue.id, alias: propertyValue.alias, title: propertyValue.title });
    }

    return accumulator;
  }

  private getState(filterName: string, lang: string): any[] {
    return get(this.state, `${filterName}.${lang}`, []) as unknown as IFilterModel[];
  }

  private getStateByFilter(filterName: string, filterValues: string[], lang: string): any[] {
    const models = get(this.state, `${filterName}.${lang}`, []) as unknown as IFilterModel[];

    return models.filter((model) => filterValues.includes(model.alias));
  }

  public getList(list: string[], lang: string): IFilterModels {
    const models = {};
    const listerKeys = Object.values(LISTEN_FILTERS);

    list.forEach((listItem) => {
      if (listerKeys.includes(listItem)) {
        Object.assign(models, {
          [listItem]: this.getState(listItem, lang),
        });
      }
    });

    return models;
  }

  public getFilterModels(filters: IFilters, lang: string): IFilterModels {
    const models = {};

    Object.entries(filters).forEach(([filterKey, filterValues]: any) => {
      Object.assign(models, {
        [filterKey]: this.getStateByFilter(filterKey, filterValues, lang),
      });
    });

    return models;
  }
}
