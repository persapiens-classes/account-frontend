import { HttpClient } from '@angular/common/http';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { Category, createCategory } from './category';
import { InjectionToken } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

export class CategoryUpdateService implements BeanUpdateService<Category, Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  update(id: string, category: Category): Observable<Category> {
    return updateBean(
      this.http,
      `${this.type.toLowerCase()}Categories`,
      createCategory,
      defaultJsonToBean,
      id,
      '/',
      category,
    );
  }
}

export const CREDIT_CATEGORY_UPDATE_SERVICE = new InjectionToken<CategoryUpdateService>(
  'CreditCategoryUpdateService',
);
export const DEBIT_CATEGORY_UPDATE_SERVICE = new InjectionToken<CategoryUpdateService>(
  'DebitCategoryUpdateService',
);
export const EQUITY_CATEGORY_UPDATE_SERVICE = new InjectionToken<CategoryUpdateService>(
  'EquityCategoryUpdateService',
);
