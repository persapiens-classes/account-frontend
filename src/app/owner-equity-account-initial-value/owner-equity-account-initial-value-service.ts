import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { createOwnerEquityAccountInitialValue, OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from "./owner-equity-account-initial-value";
import { BeanService } from "../bean/bean-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerEquityAccountInitialValueService extends BeanService<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {

  constructor(http: HttpClient) {
    super(http, "OwnerEquityAccountInitialValue", "ownerEquityAccountInitialValues", createOwnerEquityAccountInitialValue)
  }

  override idSeparator(): string {
    return '?'
  }

}
