import { LISTEN_FILTERS } from "src/constants/filters";
import {CategoryEntity} from "../../entity/category.entity";

export const FILTER_TYPE = {
  COMPANY: "company",
};

export const TYPE_ENTITIES = {
  [FILTER_TYPE.COMPANY]: {
    [LISTEN_FILTERS.CATEGORIES]: CategoryEntity,
  },
};

export const DELETE_CONDITION = {
  [FILTER_TYPE.COMPANY]: "companyId = :companyId",
};
