import { HttpClient } from '@angular/common/http';
import { BeanInsertService } from '../bean/bean-insert-service';
import { Account } from './account';
import { AccountCreateService } from './account-create-service';
import { InjectionToken } from '@angular/core';

export class AccountInsertService extends BeanInsertService<Account, Account> {
  constructor(http: HttpClient, type: string) {
    super(http, `${type} Account`, `${type.toLowerCase()}Accounts`, new AccountCreateService());
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
