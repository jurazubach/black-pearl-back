export interface IFilterPropertyValue {
  id: number;
  propertyId: number;
  alias: string;
  title: string;
}

export interface IFilterProperty {
  id: number;
  alias: string;
  title: string;
  children: IFilterPropertyValue[],
}

export interface IFilterCategory {
  id: number;
  alias: string;
  title: string;
}

export interface IFilterSize {
  alias: string;
  title: string;
}

export interface IFilterModels {
  categories: IFilterCategory[];
  sizes: IFilterSize[];
  properties: IFilterProperty[]
}
