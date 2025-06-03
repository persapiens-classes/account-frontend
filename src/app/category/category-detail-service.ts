import { InjectionToken } from "@angular/core";
import { Category } from "./category";
import { CategoryCreateService } from "./category-create-service";
import { BeanDetailService } from "../bean/bean-detail-service";

export class CategoryDetailService extends BeanDetailService<Category> {

  constructor(type: string) {
    super(`${type.toLowerCase()}Categories`, new CategoryCreateService())
  }

}

export const CREDIT_CATEGORY_DETAIL_SERVICE = new InjectionToken<CategoryDetailService>('CreditCategoryDetailService')
export const DEBIT_CATEGORY_DETAIL_SERVICE = new InjectionToken<CategoryDetailService>('DebitCategoryDetailService')
export const EQUITY_CATEGORY_DETAIL_SERVICE = new InjectionToken<CategoryDetailService>('EquityCategoryDetailService')
