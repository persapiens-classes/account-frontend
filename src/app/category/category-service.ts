import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Category } from "./category";
import { CategoryCreateService } from "./category-create-service";
import { InjectionToken } from '@angular/core';

export class CategoryService extends BeanService<Category, Category, Category> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Category`, `${type.toLowerCase()}Categories`, new CategoryCreateService())
  }

}

export const CREDIT_CATEGORY_SERVICE = new InjectionToken<CategoryService>('CreditCategoryService');
export const DEBIT_CATEGORY_SERVICE = new InjectionToken<CategoryService>('DebitCategoryService');
export const EQUITY_CATEGORY_SERVICE = new InjectionToken<CategoryService>('EquityCategoryService');
