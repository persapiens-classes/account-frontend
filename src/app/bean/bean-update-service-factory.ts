import { Bean } from "./bean";
import { inject, Injectable, InjectionToken } from "@angular/core";
import { BeanUpdateService } from "./bean-update-service";
import { CREDIT_CATEGORY_UPDATE_SERVICE, DEBIT_CATEGORY_UPDATE_SERVICE, EQUITY_CATEGORY_UPDATE_SERVICE } from "../category/category-update-service";
import { OWNER_UPDATE_SERVICE } from "../owner/owner-update-service";
import { CREDIT_ACCOUNT_UPDATE_SERVICE, DEBIT_ACCOUNT_UPDATE_SERVICE, EQUITY_ACCOUNT_UPDATE_SERVICE } from "../account/account-update-service";
import { CREDIT_ENTRY_UPDATE_SERVICE, DEBIT_ENTRY_UPDATE_SERVICE, TRANSFER_ENTRY_UPDATE_SERVICE } from "../entry/entry-update-service";
import { OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_UPDATE_SERVICE } from "../owner-equity-account-initial-value/owner-equity-account-initial-value-update-service";

@Injectable({
  providedIn: 'root'
})
export class BeanUpdateServiceFactory<T extends Bean, U> {
  mapApiUpdateService: Map<string, InjectionToken<BeanUpdateService<T, U>>>

  constructor() {
    this.mapApiUpdateService = new Map()
    this.mapApiUpdateService.set('CreditCategoryUpdateService', CREDIT_CATEGORY_UPDATE_SERVICE)
    this.mapApiUpdateService.set('DebitCategoryUpdateService', DEBIT_CATEGORY_UPDATE_SERVICE)
    this.mapApiUpdateService.set('EquityCategoryUpdateService', EQUITY_CATEGORY_UPDATE_SERVICE)

    this.mapApiUpdateService.set('CreditAccountUpdateService', CREDIT_ACCOUNT_UPDATE_SERVICE)
    this.mapApiUpdateService.set('DebitAccountUpdateService', DEBIT_ACCOUNT_UPDATE_SERVICE)
    this.mapApiUpdateService.set('EquityAccountUpdateService', EQUITY_ACCOUNT_UPDATE_SERVICE)

    this.mapApiUpdateService.set('CreditEntryUpdateService', CREDIT_ENTRY_UPDATE_SERVICE)
    this.mapApiUpdateService.set('DebitEntryUpdateService', DEBIT_ENTRY_UPDATE_SERVICE)
    this.mapApiUpdateService.set('TransferEntryUpdateService', TRANSFER_ENTRY_UPDATE_SERVICE)

    this.mapApiUpdateService.set('OwnerUpdateService', OWNER_UPDATE_SERVICE)
    this.mapApiUpdateService.set('OwnerEquityAccountInitialValueUpdateService', OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_UPDATE_SERVICE)
  }

  getBeanUpdateService(typeName: string): BeanUpdateService<T, U> {
    return inject(this.mapApiUpdateService.get(`${typeName}UpdateService`)!)
  }


}
