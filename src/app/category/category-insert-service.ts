import { HttpClient } from '@angular/common/http';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { Category, createCategory } from './category';
import { InjectionToken } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

export class CategoryInsertService implements BeanInsertService<Category, Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  insert(category: Category): Observable<Category> {
    return insertBean(
      this.http,
      `${this.type.toLowerCase()}Categories`,
      createCategory,
      defaultJsonToBean,
      category,
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
