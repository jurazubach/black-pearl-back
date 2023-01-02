import { I18nService } from 'nestjs-i18n';

export interface IProperty {
  id: number;
  alias: string;
  title: string;
}

export interface IProductProperty {
  propertyId: number;
  propertyAlias: string;
  propertyValueId: number;
  propertyValueAlias: string;
}

export interface IPropertyWithValue {
  property: IProperty;
  value: IPropertyValue;
}

export interface IPropertyValue extends IProperty {}

export const formatProductProperties = async (lang: string, i18n: I18nService, productProperties: IProductProperty[]) => {
  const properties: IPropertyWithValue[] = [];

  for await (const { propertyId, propertyAlias, propertyValueId, propertyValueAlias } of productProperties) {
    const propertyTrans = await i18n.t(`properties.${propertyAlias}`, { lang });
    const propertyValueTrans = await i18n.t(`propertyValues.${propertyValueAlias}`, { lang });

    properties.push({
      property: {
        id: propertyId,
        title: propertyTrans && propertyTrans.title ? propertyTrans.title : propertyAlias,
        alias: propertyAlias,
      },
      value: {
        id: propertyValueId,
        title: propertyValueTrans && propertyValueTrans.title ? propertyValueTrans.title : propertyValueAlias,
        alias: propertyValueAlias,
      },
    });
  }

  return properties;
};
