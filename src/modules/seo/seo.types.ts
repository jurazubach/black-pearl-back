export type IMetaData = { [key: string]: any };
export type ITemplatePath = string | null;
export type IPlaceholders = string[] | [];
export interface ITemplate {
  title: string;
  description: string;
  keywords: string[] | [];
  h1: string | null;
  robots: string;
  canonical: string | null;
}
