import { EntityManager } from "typeorm";
import get from "lodash/get";
import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { InjectEntityManager } from "@nestjs/typeorm";
import { IFilters } from "src/decorators/filters.decorators";
import { LISTEN_FILTERS } from "src/constants/filters";
import map from "lodash/map";
import { CategoryEntity } from "src/entity/category.entity";
import { USER_LANGUAGE } from "src/entity/user.entity";
import { TYPE_ENTITIES, DELETE_CONDITION } from "./filter.constants";
import {
  IFilterState,
  IFilterModel,
  IFilterModels,
  IStateLangModels,
} from "./filter.types";
import { PropertyEntity } from '../../entity/property.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { CollectionEntity } from '../../entity/collection.entity';

@Injectable()
export class FilterService {
  private state: IFilterState = {};

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly i18n: I18nService
  ) {
    this.loadState();
  }

  private async loadState() {
    const [
      categories,
      collections,
      properties,
      propertyValues,
    ] = await Promise.all([
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

  private async translateModels(
    rootPath: string,
    models: any[]
  ): Promise<IStateLangModels> {
    const accumulator: IStateLangModels = { uk: [], en: [] };

    for await (const model of models) {
      const path = `${rootPath}.${model.alias}`;
      const [uk, en] = await Promise.all([
        this.i18n.t(path, { lang: USER_LANGUAGE.UK }),
        this.i18n.t(path, { lang: USER_LANGUAGE.EN }),
      ]);

      accumulator.uk.push({ ...model, ...uk });
      accumulator.en.push({ ...model, ...en });
    }

    return accumulator;
  }

  private async getCategories() {
    const categories = await this.entityManager
      .createQueryBuilder(CategoryEntity, "c")
      .select("c.id, c.alias")
      .getRawMany<CategoryEntity>();

    return this.translateModels("categories", categories);
  }

  private async getCollections() {
    const accumulator: IStateLangModels = { uk: [], en: [] };

    const collections = await this.entityManager
      .createQueryBuilder(CollectionEntity, "c")
      .select(`c.id, c.alias, c.titleUk, c.titleEn`)
      .getRawMany<CollectionEntity>();

    for await (const collection of collections) {
      accumulator.uk.push({ id: collection.id, alias: collection.alias, title: collection.titleUk });
      accumulator.en.push({ id: collection.id, alias: collection.alias, title: collection.titleUk });
    }

    return accumulator;
  }

  private async getProperties() {
    const properties = await this.entityManager
      .createQueryBuilder(PropertyEntity, "p")
      .select("p.id, p.alias")
      .getRawMany<PropertyEntity>();

    return this.translateModels("properties", properties);
  }

  private async getPropertyValues() {
    const propertyValues = await this.entityManager
      .createQueryBuilder(PropertyValueEntity, "pv")
      .select("pv.id, pv.alias")
      .getRawMany<PropertyValueEntity>();

    return this.translateModels("propertyValues", propertyValues);
  }

  private getState(filterName: string, lang: string): any[] {
    return (get(
      this.state,
      `${filterName}.${lang}`,
      []
    ) as unknown) as IFilterModel[];
  }

  private getStateByFilter(
    filterName: string,
    filterValues: string[],
    lang: string
  ): any[] {
    const models = (get(
      this.state,
      `${filterName}.${lang}`,
      []
    ) as unknown) as IFilterModel[];

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

  async deleteRelative(type: string, entity: any, relCondition: any) {
    return this.entityManager
      .createQueryBuilder()
      .delete()
      .from(entity)
      .where(DELETE_CONDITION[type], relCondition)
      .execute();
  }

  async insertRelative(entity: any, values: any[]) {
    return this.entityManager
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(values)
      .execute();
  }

  async setFilterCategories(
    type: string,
    categoryIds: number[],
    relCondition: any
  ) {
    const entity = TYPE_ENTITIES[type][LISTEN_FILTERS.CATEGORIES];
    await this.deleteRelative(type, entity, relCondition);

    const values = categoryIds.map((categoryId) => ({
      ...relCondition,
      categoryId,
    }));

    return this.insertRelative(entity, values);
  }

  async setFilterRelatives(
    type: string,
    filters: IFilterModels,
    relCondition: any
  ) {
    const filterEntries = Object.entries(filters);
    const insertPromises = [];

    for await (const [filterKey, filterValues] of filterEntries) {
      const filterIds = map(filterValues, "id");

      if (filterKey === LISTEN_FILTERS.CATEGORIES) {
        insertPromises.push(
          this.setFilterCategories(type, filterIds, relCondition)
        );
      }
    }

    return Promise.all(insertPromises);
  }
}
