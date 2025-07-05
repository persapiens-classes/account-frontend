import { HttpClient } from '@angular/common/http';
import { Account, createAccount } from './account';
import { InjectionToken } from '@angular/core';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

export class AccountListService implements BeanListService<Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  findAll(): Observable<Account[]> {
    return findAllBeans(
      this.http,
      `${this.type.toLowerCase()}Accounts`,
      createAccount,
      defaultJsonToBean,
    );
  }
}

export const CREDIT_ACCOUNT_LIST_SERVICE = new InjectionToken<AccountListService>(
  'CreditAccountListService',
);
export const DEBIT_ACCOUNT_LIST_SERVICE = new InjectionToken<AccountListService>(
  'DebitAccountListService',
);
export const EQUITY_ACCOUNT_LIST_SERVICE = new InjectionToken<AccountListService>(
  'EquityAccountListService',
);
