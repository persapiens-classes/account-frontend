import { InjectionToken } from '@angular/core';
import { BeanDetailService } from '../bean/bean-detail-service';

export class AccountDetailService extends BeanDetailService {
  constructor(type: string) {
    super(`${type.toLowerCase()}Accounts`);
  }
}

export const CREDIT_ACCOUNT_DETAIL_SERVICE = new InjectionToken<AccountDetailService>(
  'CreditAccountDetailService',
);
export const DEBIT_ACCOUNT_DETAIL_SERVICE = new InjectionToken<AccountDetailService>(
  'DebitAccountDetailService',
);
export const EQUITY_ACCOUNT_DETAIL_SERVICE = new InjectionToken<AccountDetailService>(
  'EquityAccountDetailService',
);
