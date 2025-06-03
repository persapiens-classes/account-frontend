import { HttpClient } from "@angular/common/http";
import { BeanUpdateService } from "../bean/bean-update-service";
import { Category } from "./category";
import { CategoryCreateService } from "./category-create-service";
import { InjectionToken } from '@angular/core';

export class CategoryUpdateService extends BeanUpdateService<Category, Category> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Category`, `${type.toLowerCase()}Categories`, new CategoryCreateService())
  }

}

export const CREDIT_CATEGORY_UPDATE_SERVICE = new InjectionToken<CategoryUpdateService>('CreditCategoryUpdateService');
export const DEBIT_CATEGORY_UPDATE_SERVICE = new InjectionToken<CategoryUpdateService>('DebitCategoryUpdateService');
export const EQUITY_CATEGORY_UPDATE_SERVICE = new InjectionToken<CategoryUpdateService>('EquityCategoryUpdateService');
