import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { ConfigService } from "@nestjs/config";
import {
  MAX_FILTER_INDEXING,
  MAX_MULTIPLE_FILTER_INDEXING,
} from "src/constants/seo";
import {
  fillPlaceholders,
  getTemplatePlaceholders,
  replaceTemplatePlaceholders,
} from "./seo.helpers";
import {
  ITemplate,
  ITemplatePath,
  IMetaData,
  IPlaceholders,
} from "./seo.types";
import { IPagination } from "../../decorators/pagination.decorators";
import { IFilterModels } from "../filter/filter.types";
import { DEFAULT_PAGE } from "src/constants/pagination";

interface IMetaTagOptions {
  lang?: string;
  pagination?: IPagination;
  filterModels?: IFilterModels;
  metaData?: IMetaData;
  noIndex?: boolean;
}

@Injectable()
export class SeoService {
  private readonly defaultLang: string;

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService
  ) {
    this.defaultLang = configService.get<string>("defaultLang", "uk");
  }

  public async getMetaTags(
    templatePath: ITemplatePath,
    options: IMetaTagOptions = {}
  ): Promise<ITemplate> {
    const {
      lang = this.defaultLang,
      pagination,
      filterModels = {},
      metaData = {},
      noIndex = false,
    } = options;

    const template = {
      robots: noIndex ? "noindex, nofollow" : "index, follow",
      canonical: null,
    } as ITemplate;

    // простые переводы аля "страница, страна тд и тп"
    const dictionary = await this.i18n.t("seo.dictionary", { lang });

    // дефолтные текста для метатегов title, description, keywords, h1
    const defaultTemplate = await this.i18n.t("seo.default", { lang });
    Object.assign(template, defaultTemplate);

    if (templatePath) {
      // тут перезаписываем чем-то что нашли новое
      const searchTemplate = await this.i18n.t(`seo.${templatePath}`, { lang });
      if (typeof searchTemplate === "object") {
        Object.assign(template, searchTemplate);
      }
    }

    // в полученых строках ищем {} кавычки плейсхолдеров
    const templatePlaceholders: IPlaceholders = getTemplatePlaceholders(
      template
    );

    // вот здесь мы заполняем плейсхолдеры какими-то данными
    const filledPlaceholders = fillPlaceholders(templatePlaceholders, {
      page: pagination ? pagination.page : DEFAULT_PAGE,
      filterModels,
      metaData,
      dictionary,
    });

    const calculateFilters = {
      hasOneFilter: Object.values(filterModels).length === 1,
      hasMultipleFilters: Object.values(filterModels).some(
        (values: any) => values.length >= MAX_MULTIPLE_FILTER_INDEXING
      ),
      hasMoreThatOneFilter:
        Object.keys(filterModels).length >= MAX_FILTER_INDEXING,
      hasMoreThatOnePage: pagination ? pagination.page > DEFAULT_PAGE : false,
    };

    replaceTemplatePlaceholders(template, filledPlaceholders, calculateFilters);

    return template;
  }
}
