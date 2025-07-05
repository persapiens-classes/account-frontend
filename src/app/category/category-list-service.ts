import { HttpClient } from '@angular/common/http';
import { Category, createCategory } from './category';
import { InjectionToken } from '@angular/core';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

export class CategoryListService implements BeanListService<Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  findAll(): Observable<Category[]> {
    return findAllBeans(
      this.http,
      `${this.type.toLowerCase()}Categories`,
      createCategory,
      defaultJsonToBean,
    );
  }
}

export const CREDIT_CATEGORY_LIST_SERVICE = new InjectionToken<CategoryListService>(
  'CreditCategoryListService',
);
export const DEBIT_CATEGORY_LIST_SERVICE = new InjectionToken<CategoryListService>(
  'DebitCategoryListService',
);
export const EQUITY_CATEGORY_LIST_SERVICE = new InjectionToken<CategoryListService>(
  'EquityCategoryListService',
);
