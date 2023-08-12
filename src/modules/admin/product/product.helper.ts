export interface IProperty {
  id: number;
  alias: string;
  title: string;
}

export type IPropertyValue = IProperty

export interface IPropertyWithValue {
  property: IProperty;
  value: IPropertyValue;
}
