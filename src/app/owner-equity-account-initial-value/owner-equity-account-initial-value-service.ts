import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from "./owner-equity-account-initial-value";
import { BeanService } from "../bean/bean-service";
import { OwnerEquityAccountInitialValueCreateService } from "./owner-equity-account-initial-value-create-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerEquityAccountInitialValueService extends BeanService<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {

  constructor(http: HttpClient) {
    super(http, "OwnerEquityAccountInitialValue", "ownerEquityAccountInitialValues",
      new OwnerEquityAccountInitialValueCreateService())
  }

  override idSeparator(): string {
    return '?'
  }

}
