import { HttpClient } from '@angular/common/http';
import { Account } from './account';
import { AccountCreateService } from './account-create-service';
import { InjectionToken } from '@angular/core';
import { BeanListService } from '../bean/bean-list-service';

export class AccountListService extends BeanListService<Account> {
  constructor(http: HttpClient, type: string) {
    super(http, `${type.toLowerCase()}Accounts`, new AccountCreateService());
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
