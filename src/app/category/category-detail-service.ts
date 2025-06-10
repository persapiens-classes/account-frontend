import { InjectionToken } from '@angular/core';
import { BeanDetailService } from '../bean/bean-detail-service';

export class CategoryDetailService extends BeanDetailService {
  constructor(type: string) {
    super(`${type.toLowerCase()}Categories`);
  }
}

export const CREDIT_CATEGORY_DETAIL_SERVICE = new InjectionToken<CategoryDetailService>(
  'CreditCategoryDetailService',
);
export const DEBIT_CATEGORY_DETAIL_SERVICE = new InjectionToken<CategoryDetailService>(
  'DebitCategoryDetailService',
);
export const EQUITY_CATEGORY_DETAIL_SERVICE = new InjectionToken<CategoryDetailService>(
  'EquityCategoryDetailService',
);
