import { Injectable, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from "./owner-equity-account-initial-value";
import { BeanInsertService } from "../bean/bean-insert-service";
import { OwnerEquityAccountInitialValueCreateService } from "./owner-equity-account-initial-value-create-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerEquityAccountInitialValueInsertService extends BeanInsertService<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert> {

  constructor(http: HttpClient) {
    super(http, "OwnerEquityAccountInitialValue", "ownerEquityAccountInitialValues",
      new OwnerEquityAccountInitialValueCreateService())
  }

}

export const OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_INSERT_SERVICE = new InjectionToken<OwnerEquityAccountInitialValueInsertService>('OwnerEquityAccountInitialValueInsertService')