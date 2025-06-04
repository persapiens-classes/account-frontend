import { HttpClient } from '@angular/common/http';
import { Category } from './category';
import { InjectionToken } from '@angular/core';
import { BeanRemoveService } from '../bean/bean-remove-service';

export class CategoryRemoveService extends BeanRemoveService<Category> {
  constructor(http: HttpClient, type: string) {
    super(http, `${type} Category`, `${type.toLowerCase()}Categories`);
  }
}

export const CREDIT_CATEGORY_REMOVE_SERVICE = new InjectionToken<CategoryRemoveService>(
  'CreditCategoryRemoveService',
);
export const DEBIT_CATEGORY_REMOVE_SERVICE = new InjectionToken<CategoryRemoveService>(
  'DebitCategoryRemoveService',
);
export const EQUITY_CATEGORY_REMOVE_SERVICE = new InjectionToken<CategoryRemoveService>(
  'EquityCategoryRemoveService',
);
