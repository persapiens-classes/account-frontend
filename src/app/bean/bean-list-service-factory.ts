import { Bean } from "./bean";
import { inject, Injectable, InjectionToken } from "@angular/core";
import { BeanListService } from "./bean-list-service";
import { CREDIT_CATEGORY_LIST_SERVICE, DEBIT_CATEGORY_LIST_SERVICE, EQUITY_CATEGORY_LIST_SERVICE } from "../category/category-list-service";
import { OWNER_LIST_SERVICE } from "../owner/owner-list-service";
import { CREDIT_ACCOUNT_LIST_SERVICE, DEBIT_ACCOUNT_LIST_SERVICE, EQUITY_ACCOUNT_LIST_SERVICE } from "../account/account-list-service";
import { CREDIT_ENTRY_LIST_SERVICE, DEBIT_ENTRY_LIST_SERVICE, TRANSFER_ENTRY_LIST_SERVICE } from "../entry/entry-list-service";
import { BALANCE_LIST_SERVICE } from "../owner-equity-account-initial-value/balance-list-service";

@Injectable({
  providedIn: 'root'
})
export class BeanListServiceFactory<T extends Bean> {
  mapApiListService: Map<string, InjectionToken<BeanListService<T>>>

  constructor() {
    this.mapApiListService = new Map()
    this.mapApiListService.set('CreditCategoryListService', CREDIT_CATEGORY_LIST_SERVICE)
    this.mapApiListService.set('DebitCategoryListService', DEBIT_CATEGORY_LIST_SERVICE)
    this.mapApiListService.set('EquityCategoryListService', EQUITY_CATEGORY_LIST_SERVICE)

    this.mapApiListService.set('CreditAccountListService', CREDIT_ACCOUNT_LIST_SERVICE)
    this.mapApiListService.set('DebitAccountListService', DEBIT_ACCOUNT_LIST_SERVICE)
    this.mapApiListService.set('EquityAccountListService', EQUITY_ACCOUNT_LIST_SERVICE)

    this.mapApiListService.set('CreditEntryListService', CREDIT_ENTRY_LIST_SERVICE)
    this.mapApiListService.set('DebitEntryListService', DEBIT_ENTRY_LIST_SERVICE)
    this.mapApiListService.set('TransferEntryListService', TRANSFER_ENTRY_LIST_SERVICE)

    this.mapApiListService.set('OwnerListService', OWNER_LIST_SERVICE)
    this.mapApiListService.set('BalanceListService', BALANCE_LIST_SERVICE)
  }

  getBeanListService(typeName: string): BeanListService<T> {
    return inject(this.mapApiListService.get(`${typeName}ListService`)!)
  }

}
