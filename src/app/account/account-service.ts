import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Account } from "./account";

export class AccountService extends BeanService<Account, string> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Account`, `${type.toLowerCase()}Accounts`, createBean)
  }

}

function createBean(): Account {
  return new Account('', '')
}