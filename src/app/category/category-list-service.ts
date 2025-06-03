import { HttpClient } from "@angular/common/http";
import { Category } from "./category";
import { CategoryCreateService } from "./category-create-service";
import { InjectionToken } from '@angular/core';
import { BeanListService } from "../bean/bean-list-service";

export class CategoryListService extends BeanListService<Category> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type.toLowerCase()}Categories`, new CategoryCreateService())
  }

}

export const CREDIT_CATEGORY_LIST_SERVICE = new InjectionToken<CategoryListService>('CreditCategoryListService');
export const DEBIT_CATEGORY_LIST_SERVICE = new InjectionToken<CategoryListService>('DebitCategoryListService');
export const EQUITY_CATEGORY_LIST_SERVICE = new InjectionToken<CategoryListService>('EquityCategoryListService');
