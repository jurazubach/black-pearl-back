import { Injectable } from '@nestjs/common';
import _round from 'lodash/round';
import { MAX_FILTER_INDEXING, MAX_MULTIPLE_FILTER_INDEXING } from 'src/constants/seo';
import { IPagination } from 'src/decorators/pagination.decorators';
import { IFilterModels } from 'src/modules/filter/filter.types';
import { DEFAULT_PAGE } from 'src/constants/pagination';
import { ITemplate, ITemplatePath, IMetaData, IPlaceholders } from './seo.types';
import { fillPlaceholders, getTemplatePlaceholders, replaceTemplatePlaceholders } from './seo.helpers';

interface IMetaTagOptions {
  pagination?: IPagination;
  filterModels?: IFilterModels;
  metaData?: IMetaData;
  noIndex?: boolean;
}

const i18n = {
  "default": {
    "title": "HOROBRI – Головна",
    "description": "HOROBRI - український бренд одягу, об'єднав в собі  утилітарний, лаконічний і зручний дизайн. Динамічний ритм життя і прагнення до свободи творчих людей надихнув нас створювати самобутний одяг оверсайз.",
    "keywords": "HOROBRI, horobri, хоробрі, Україна, одяг",
    "h1": "HOROBRI – Головна"
  },
  "dictionary": {
    "page": "сторінка"
  },
};

@Injectable()
export class SeoService {
  public async getMetaTags(templatePath: ITemplatePath, options: IMetaTagOptions = {}): Promise<ITemplate> {
    const { pagination, filterModels = { categories: [], properties: [], sizes: [] }, metaData = {}, noIndex = false } = options;

    const template = {
      robots: noIndex ? 'noindex, nofollow' : 'index, follow',
      canonical: null,
    } as ITemplate;

    // простые переводы аля "страница, страна тд и тп"
    const dictionary = i18n.dictionary;

    // дефолтные текста для метатегов title, description, keywords, h1
    const defaultTemplate = i18n.default;
    Object.assign(template, defaultTemplate);

    if (templatePath) {
      // тут перезаписываем чем-то что нашли новое
      const searchTemplate = {};
      if (typeof searchTemplate === 'object') {
        Object.assign(template, searchTemplate);
      }
    }

    // в полученых строках ищем {} кавычки плейсхолдеров
    const templatePlaceholders: IPlaceholders = getTemplatePlaceholders(template);

    // вот здесь мы заполняем плейсхолдеры какими-то данными
    const filledPlaceholders = fillPlaceholders(templatePlaceholders, {
      page: pagination ? pagination.page : DEFAULT_PAGE,
      filterModels,
      metaData,
      dictionary,
    });

    const countApplyFilter = _round(
      (filterModels.categories.length > 0 ? 1 : 0)
      + (filterModels.sizes.length > 0 ? 1 : 0)
      + (filterModels.properties.length > 0 ? 1 : 0), 0);

    const hasMultipleFilters = _round(
      (filterModels.categories.length >= MAX_MULTIPLE_FILTER_INDEXING ? 1 : 0)
      + (filterModels.sizes.length >= MAX_MULTIPLE_FILTER_INDEXING ? 1 : 0)
      + (filterModels.properties.length >= MAX_MULTIPLE_FILTER_INDEXING ? 1 : 0), 0);

    const calculateFilters = {
      hasOneFilter: countApplyFilter === 1,
      hasMultipleFilters: hasMultipleFilters,
      hasMoreThatOneFilter: countApplyFilter >= MAX_FILTER_INDEXING,
      hasMoreThatOnePage: pagination ? pagination.page > DEFAULT_PAGE : false,
    };

    replaceTemplatePlaceholders(template, filledPlaceholders, calculateFilters);

    return template;
  }
}
