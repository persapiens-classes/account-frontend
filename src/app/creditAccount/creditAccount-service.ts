import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { CreditAccount } from "./creditAccount";

@Injectable({
  providedIn: 'root'
})
export class CreditAccountService extends BeanService <CreditAccount, string> {
  
  constructor(http: HttpClient) {
    super(http, "CreditAccount", "creditAccounts", createBean)
  }
  
}

function createBean(): CreditAccount {
  return new CreditAccount('', '')
}