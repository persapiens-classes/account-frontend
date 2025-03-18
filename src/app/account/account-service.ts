import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Account, createAccount } from "./account";

export class AccountService extends BeanService<Account, Account, string> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Account`, `${type.toLowerCase()}Accounts`, createAccount)
  }

}
