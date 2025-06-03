import { Injectable, InjectionToken } from "@angular/core";
import { BeanDetailService } from "../bean/bean-detail-service";
import { BalanceCreateService } from "./balance-create-service";
import { Balance } from "./balance";

@Injectable({
  providedIn: 'root'
})
export class BalanceDetailService extends BeanDetailService<Balance> {

  constructor() {
    super("balances", new BalanceCreateService())
  }

}

export const BALANCE_DETAIL_SERVICE = new InjectionToken<BalanceDetailService>('BalanceDetailService')
