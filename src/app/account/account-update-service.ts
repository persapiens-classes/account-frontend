import { HttpClient } from '@angular/common/http';
import { Account, createAccount } from './account';
import { InjectionToken } from '@angular/core';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

export class AccountUpdateService implements BeanUpdateService<Account, Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  update(id: string, account: Account): Observable<Account> {
    return updateBean(
      this.http,
      `${this.type.toLowerCase()}Accounts`,
      createAccount,
      defaultJsonToBean,
      id,
      '/',
      account,
    );
  }
}

export const CREDIT_ACCOUNT_UPDATE_SERVICE = new InjectionToken<AccountUpdateService>(
  'CreditAccountUpdateService',
);
export const DEBIT_ACCOUNT_UPDATE_SERVICE = new InjectionToken<AccountUpdateService>(
  'DebitAccountUpdateService',
);
export const EQUITY_ACCOUNT_UPDATE_SERVICE = new InjectionToken<AccountUpdateService>(
  'EquityAccountUpdateService',
);
