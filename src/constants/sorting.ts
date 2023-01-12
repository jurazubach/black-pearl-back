export enum ESortPage {
  RECOMMEND = 'recommend',
  ASC_PRICE = 'ascPrice',
  DESC_PRICE = 'descPrice',
  NOVELTY = 'novelty',
}
export type TSortPage = ESortPage.RECOMMEND | ESortPage.ASC_PRICE | ESortPage.DESC_PRICE | ESortPage.NOVELTY;
export const DEFAULT_SORT = ESortPage.RECOMMEND;
