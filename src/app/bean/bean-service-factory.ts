import { Bean } from "./bean";
import { inject, Injectable, InjectionToken } from "@angular/core";
import { BeanService } from "./bean-service";
import { OWNER_SERVICE } from "../owner/owner-service";
import { OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_SERVICE } from "../owner-equity-account-initial-value/owner-equity-account-initial-value-service";
import { CREDIT_CATEGORY_SERVICE, DEBIT_CATEGORY_SERVICE, EQUITY_CATEGORY_SERVICE } from "../category/category-service";
import { CREDIT_ENTRY_SERVICE, DEBIT_ENTRY_SERVICE, TRANSFER_ENTRY_SERVICE } from "../entry/entry-service";
import { CREDIT_ACCOUNT_SERVICE, DEBIT_ACCOUNT_SERVICE, EQUITY_ACCOUNT_SERVICE } from "../account/account-service";

@Injectable({
  providedIn: 'root'
})
export class BeanServiceFactory<T extends Bean, I, U> {
  mapApiService: Map<string, InjectionToken<BeanService<T, I, U>>>

  constructor() {
    this.mapApiService = new Map()
    this.mapApiService.set('CreditCategoryService', CREDIT_CATEGORY_SERVICE)
    this.mapApiService.set('DebitCategoryService', DEBIT_CATEGORY_SERVICE)
    this.mapApiService.set('EquityCategoryService', EQUITY_CATEGORY_SERVICE)

    this.mapApiService.set('CreditAccountService', CREDIT_ACCOUNT_SERVICE)
    this.mapApiService.set('DebitAccountService', DEBIT_ACCOUNT_SERVICE)
    this.mapApiService.set('EquityAccountService', EQUITY_ACCOUNT_SERVICE)

    this.mapApiService.set('CreditEntryService', CREDIT_ENTRY_SERVICE)
    this.mapApiService.set('DebitEntryService', DEBIT_ENTRY_SERVICE)
    this.mapApiService.set('TransferEntryService', TRANSFER_ENTRY_SERVICE)

    this.mapApiService.set('OwnerService', OWNER_SERVICE)
    this.mapApiService.set('OwnerEquityAccountInitialValueService', OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_SERVICE)
  }

  getBeanService(typeName: string): BeanService<T, I, U> {
    return inject(this.mapApiService.get(`${typeName}Service`)!)
  }

}
