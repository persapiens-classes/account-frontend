import { PATHS } from '../app.paths';
import { CategoryType } from './category';

export const categoryTypeNameMap: Record<CategoryType, string> = {
  [CategoryType.DEBIT]: 'DEBIT',
  [CategoryType.CREDIT]: 'CREDIT',
  [CategoryType.EQUITY]: 'EQUITY',
};

export const categoryRouterNameMap: Record<CategoryType, string> = {
  [CategoryType.DEBIT]: `debit${PATHS.CATEGORY_PATH}`,
  [CategoryType.CREDIT]: `credit${PATHS.CATEGORY_PATH}`,
  [CategoryType.EQUITY]: `equity${PATHS.CATEGORY_PATH}`,
};
