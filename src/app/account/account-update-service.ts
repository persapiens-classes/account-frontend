import { HttpClient } from '@angular/common/http';
import { Account, createAccount } from './account';
import { InjectionToken } from '@angular/core';
import { BeanUpdateService } from '../bean/bean-update-service';
import { defaultJsonToBean } from '../bean/bean';

export class AccountUpdateService extends BeanUpdateService<Account, Account> {
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

export const CREDIT_ACCOUNT_UPDATE_SERVICE = new InjectionToken<AccountUpdateService>(
  'CreditAccountUpdateService',
);
export const DEBIT_ACCOUNT_UPDATE_SERVICE = new InjectionToken<AccountUpdateService>(
  'DebitAccountUpdateService',
);
export const EQUITY_ACCOUNT_UPDATE_SERVICE = new InjectionToken<AccountUpdateService>(
  'EquityAccountUpdateService',
);
