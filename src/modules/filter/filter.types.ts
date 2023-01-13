export interface IFilterModel {
  id: number;
  alias: string;
  title: string;
  description?: string;
}

export interface IStateLangModels {
  en: IFilterModel[];
  uk: IFilterModel[];
}

export interface IFilterState {
  [key: string]: IStateLangModels;
}

export interface IFilterModels {
  [key: string]: IFilterModel[] | [];
}
