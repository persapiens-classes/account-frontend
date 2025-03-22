import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Account } from "./account";
import { AccountCreateService } from "./account-create-service";

export class AccountService extends BeanService<Account, Account, Account> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Account`, `${type.toLowerCase()}Accounts`, new AccountCreateService())
  }

}
