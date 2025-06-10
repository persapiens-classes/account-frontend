import { HttpClient } from '@angular/common/http';
import { BeanInsertService } from '../bean/bean-insert-service';
import { Account, createAccount } from './account';
import { InjectionToken } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';

export class AccountInsertService extends BeanInsertService<Account, Account> {
  constructor(http: HttpClient, type: string) {
    super(
      http,
      `${type} Account`,
      `${type.toLowerCase()}Accounts`,
      createAccount,
      defaultJsonToBean,
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
