import { Account } from "./account";
import { AccountCreateService } from "./account-create-service";
import { InjectionToken } from "@angular/core";
import { BeanDetailService } from "../bean/bean-detail-service";

export class AccountDetailService extends BeanDetailService<Account> {

  constructor(type: string) {
    super(`${type.toLowerCase()}Accounts`, new AccountCreateService())
  }

}

export const CREDIT_ACCOUNT_DETAIL_SERVICE = new InjectionToken<AccountDetailService>('CreditAccountDetailService');
export const DEBIT_ACCOUNT_DETAIL_SERVICE = new InjectionToken<AccountDetailService>('DebitAccountDetailService');
export const EQUITY_ACCOUNT_DETAIL_SERVICE = new InjectionToken<AccountDetailService>('EquityAccountDetailService');
