import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { BeanRemoveService, removeBean } from '../bean/bean-remove-service';
import { Observable } from 'rxjs';

export class AccountRemoveService implements BeanRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  remove(id: string): Observable<void> {
    return removeBean(this.http, `${this.type.toLowerCase()}Accounts`, id, '/');
  }
}

export const CREDIT_ACCOUNT_REMOVE_SERVICE = new InjectionToken<AccountRemoveService>(
  'CreditAccountRemoveService',
);
export const DEBIT_ACCOUNT_REMOVE_SERVICE = new InjectionToken<AccountRemoveService>(
  'DebitAccountRemoveService',
);
export const EQUITY_ACCOUNT_REMOVE_SERVICE = new InjectionToken<AccountRemoveService>(
  'EquityAccountRemoveService',
);
