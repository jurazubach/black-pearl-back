import uniq from 'lodash/uniq';
import capitalize from 'lodash/capitalize';
import dayjs from 'dayjs';

import { ITemplate, IPlaceholders } from './seo.types';
import { DEFAULT_PAGE } from 'src/constants/pagination';
import {
  ROBOT_TYPES,
  PLACEHOLDER_REGEX,
  BEGIN_DELIMITER_REGEX,
  DOUBLE_DELIMITER_REGEX,
  END_DELIMITER_REGEX,
  SPACING_REGEX,
} from 'src/constants/seo';
import { LISTEN_FILTERS } from 'src/constants/filters';
import { IFilterModels } from '../filter/filter.types';

function getTemplatePlaceholders(template: ITemplate): IPlaceholders {
  let templatePlaceHolders: IPlaceholders = [];

  Object.values(template).forEach((templateValue: any) => {
    if (typeof templateValue === 'string') {
      const placeholders: string[] = templateValue.match(/({\w+})/gim) || [];
      templatePlaceHolders = [...templatePlaceHolders, ...placeholders];
    }
  });

  return uniq(templatePlaceHolders);
}

function prepareFilterValues(prefix: string, filterValues: string[]) {
  const firstWord = capitalize(prefix);
  const concatValues = filterValues.map((value) => capitalize(value)).join(', ');

  return `${firstWord} - ${concatValues}`;
}

function replaceRegexp(text: string) {
  return String(text)
    .replace(BEGIN_DELIMITER_REGEX, '')
    .replace(END_DELIMITER_REGEX, '')
    .replace(DOUBLE_DELIMITER_REGEX, '|')
    .replace(SPACING_REGEX, ' ')
    .trim();
}

function replacePlaceholder(text: string, placeholderKey: string, placeholderValue: string) {
  return String(text).replace(placeholderKey, placeholderValue ? `| ${placeholderValue} |` : '');
}

function replacePlaceholders(text: string | number, filledPlaceholders: any): string {
  let beginText = String(text);

  const placeholders: string[] = beginText.match(PLACEHOLDER_REGEX) || [];

  placeholders.forEach((placeholder) => {
    beginText = replacePlaceholder(beginText, placeholder, filledPlaceholders[placeholder]);
  });

  return replaceRegexp(beginText);
}

function replaceTemplatePlaceholders(
  template: ITemplate,
  filledPlaceholders: { [key: string]: string },
  calculateFilters: { [key: string]: any },
): void {
  const { hasOneFilter, hasMoreThatOnePage, hasMoreThatOneFilter, hasMultipleFilters } = calculateFilters;

  Object.entries(template).forEach(([templateKey, templateValue]) => {
    if (templateKey === 'h1') {
      const replaceFilledPlaceholders = hasOneFilter && !hasMultipleFilters ? filledPlaceholders : filledPlaceholders;
      // hasOneFilter && !hasMultipleFilters ? filledPlaceholders : {};
      // TODO: реплейс посмотреть, почемуто возвращается {} вместо нормального title
      Object.assign(template, {
        h1: replacePlaceholders(String(templateValue), replaceFilledPlaceholders),
      });

      return;
    }

    if (templateKey === 'robots') {
      if (hasMoreThatOnePage || hasMoreThatOneFilter || hasMultipleFilters) {
        Object.assign(template, { robots: ROBOT_TYPES.NOINDEX_NOFOLLOW });
      }

      return;
    }

    return Object.assign(template, {
      [templateKey]:
        typeof templateValue === 'string' ? replacePlaceholders(String(templateValue), filledPlaceholders) : templateValue,
    });
  });
}

interface IFillOptions {
  page: number;
  filterModels: IFilterModels;
  metaData: { [key: string]: string };
  dictionary: { [key: string]: string };
}

function fillPlaceholders(placeholders: IPlaceholders, options: IFillOptions) {
  const { page, filterModels, metaData, dictionary } = options;

  const filledPlaceholders: { [key: string]: string } = {};
  placeholders.forEach((placeholder) => {
    // из {page} делаем page, и возможно тут же какие-то доп значение
    // через |
    const filterKey: string = placeholder.replace('{', '').replace('}', '').trim();

    if (filterKey === 'page') {
      Object.assign(filledPlaceholders, {
        [placeholder]: Number(page) !== DEFAULT_PAGE ? prepareFilterValues(dictionary['page'], [String(page)]) : '',
      });
    }

    if (Object.values(LISTEN_FILTERS).includes(filterKey)) {
      if (filterKey !== LISTEN_FILTERS.CATEGORIES && filterKey !== LISTEN_FILTERS.SIZE) {
        const itemFilter = filterModels.properties.find((i) => i.alias === filterKey) || null;
        if (itemFilter) {
          const itemTitles = itemFilter.children.map(({ title }: any) => title);

          Object.assign(filledPlaceholders, {
            [placeholder]: itemTitles.length ? prepareFilterValues(dictionary[filterKey], itemTitles) : '',
          });
        }
      }
    }

    // если есть в мета данных и нету в уже записанном
    if (metaData[filterKey] && !filledPlaceholders[placeholder]) {
      Object.assign(filledPlaceholders, { [placeholder]: metaData[filterKey] });
    }

    if (filterKey === 'year') {
      const currentYear = dayjs().format('YYYY');
      Object.assign(filledPlaceholders, { [placeholder]: currentYear });
    }
  });

  return filledPlaceholders;
}

export { getTemplatePlaceholders, fillPlaceholders, replaceTemplatePlaceholders };
