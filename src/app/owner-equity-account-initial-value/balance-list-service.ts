import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { Balance } from "./balance";
import { BalanceCreateService } from "./balance-create-service";
import { BeanListService } from "../bean/bean-list-service";

@Injectable({
  providedIn: 'root'
})
export class BalanceListService extends BeanListService<Balance> {

  constructor(http: HttpClient) {
    super(http, "balances", new BalanceCreateService())
  }
}

export const BALANCE_LIST_SERVICE = new InjectionToken<BalanceListService>('BalanceListService')