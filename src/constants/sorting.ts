export enum ESortPage {
  ASC_PRICE = 'asc',
  DESC_PRICE = 'desc',
  NOVELTY = 'novelty',
  POPULAR = 'popular',
}
export type TSortPage = ESortPage.POPULAR | ESortPage.ASC_PRICE | ESortPage.DESC_PRICE | ESortPage.NOVELTY;
export const DEFAULT_SORT = ESortPage.POPULAR;
