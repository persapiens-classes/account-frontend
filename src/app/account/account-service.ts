import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Account } from "./account";
import { AccountCreateService } from "./account-create-service";
import { InjectionToken } from "@angular/core";

export class AccountService extends BeanService<Account, Account, Account> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Account`, `${type.toLowerCase()}Accounts`, new AccountCreateService())
  }

}

export const CREDIT_ACCOUNT_SERVICE = new InjectionToken<AccountService>('CreditAccountService');
export const DEBIT_ACCOUNT_SERVICE = new InjectionToken<AccountService>('DebitAccountService');
export const EQUITY_ACCOUNT_SERVICE = new InjectionToken<AccountService>('EquityAccountService');
