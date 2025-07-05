import { HttpClient } from '@angular/common/http';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { Account, createAccount } from './account';
import { InjectionToken } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

export class AccountInsertService implements BeanInsertService<Account, Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  insert(account: Account): Observable<Account> {
    return insertBean(
      this.http,
      `${this.type.toLowerCase()}Accounts`,
      createAccount,
      defaultJsonToBean,
      account,
    );
  }
}

export const CREDIT_ACCOUNT_INSERT_SERVICE = new InjectionToken<AccountInsertService>(
  'CreditAccountInsertService',
);
export const DEBIT_ACCOUNT_INSERT_SERVICE = new InjectionToken<AccountInsertService>(
  'DebitAccountInsertService',
);
export const EQUITY_ACCOUNT_INSERT_SERVICE = new InjectionToken<AccountInsertService>(
  'EquityAccountInsertService',
);
