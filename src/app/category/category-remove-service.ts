import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { BeanRemoveService, removeBean } from '../bean/bean-remove-service';
import { Observable } from 'rxjs';

export class CategoryRemoveService implements BeanRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  remove(id: string): Observable<void> {
    return removeBean(this.http, `${this.type.toLowerCase()}Categories`, id, '/');
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
