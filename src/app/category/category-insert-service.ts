import { HttpClient } from '@angular/common/http';
import { BeanInsertService } from '../bean/bean-insert-service';
import { Category, createCategory } from './category';
import { InjectionToken } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';

export class CategoryInsertService extends BeanInsertService<Category, Category> {
  constructor(http: HttpClient, type: string) {
    super(
      http,
      `${type} Category`,
      `${type.toLowerCase()}Categories`,
      createCategory,
      defaultJsonToBean,
    );
  }
}

export const CREDIT_CATEGORY_INSERT_SERVICE = new InjectionToken<CategoryInsertService>(
  'CreditCategoryInsertService',
);
export const DEBIT_CATEGORY_INSERT_SERVICE = new InjectionToken<CategoryInsertService>(
  'DebitCategoryInsertService',
);
export const EQUITY_CATEGORY_INSERT_SERVICE = new InjectionToken<CategoryInsertService>(
  'EquityCategoryInsertService',
);
