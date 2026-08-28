/// <reference types="cypress" />

import { ModelCrudApiMock, validate } from './model-crud-api-mock';
import { categoriesDefault } from '../fakers/models-default';
import { Category, CategoryType } from '../../../src/app/category/category';
import { categoryApiPath } from '../../e2e/category/category-helpers';

export function categoryApiMock(
  type: CategoryType,
): ModelCrudApiMock<Category, Category, Category, string> {
  const categoriesEndpoint = `/${categoryApiPath(type)}`;

  const idFn = (model: Category): string => model.description;

  const validateFn = (category: Category | undefined): string | null => {
    return validate('Category description', category?.description);
  };

  const categories = categoriesDefault(type);

  return new ModelCrudApiMock<Category, Category, Category, string>({
    endpoint: categoriesEndpoint,
    idFn: idFn,
    models: categories,
    postValidateFn: validateFn,
    putValidateFn: validateFn,
  });
}
