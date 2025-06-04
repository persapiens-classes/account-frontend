import { Bean } from './bean';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { OWNER_DETAIL_SERVICE } from '../owner/owner-detail-service';
import { BeanDetailService } from './bean-detail-service';
import {
  CREDIT_CATEGORY_DETAIL_SERVICE,
  DEBIT_CATEGORY_DETAIL_SERVICE,
  EQUITY_CATEGORY_DETAIL_SERVICE,
} from '../category/category-detail-service';
import {
  CREDIT_ACCOUNT_DETAIL_SERVICE,
  DEBIT_ACCOUNT_DETAIL_SERVICE,
  EQUITY_ACCOUNT_DETAIL_SERVICE,
} from '../account/account-detail-service';
import {
  CREDIT_ENTRY_DETAIL_SERVICE,
  DEBIT_ENTRY_DETAIL_SERVICE,
  TRANSFER_ENTRY_DETAIL_SERVICE,
} from '../entry/entry-detail-service';
import { BALANCE_DETAIL_SERVICE } from '../owner-equity-account-initial-value/balance-detail-service';

@Injectable({
  providedIn: 'root',
})
export class BeanDetailServiceFactory<T extends Bean> {
  mapApiDetailService: Map<string, InjectionToken<BeanDetailService<T>>>;

  constructor() {
    this.mapApiDetailService = new Map();
    this.mapApiDetailService.set('CreditCategoryDetailService', CREDIT_CATEGORY_DETAIL_SERVICE);
    this.mapApiDetailService.set('DebitCategoryDetailService', DEBIT_CATEGORY_DETAIL_SERVICE);
    this.mapApiDetailService.set('EquityCategoryDetailService', EQUITY_CATEGORY_DETAIL_SERVICE);

    this.mapApiDetailService.set('CreditAccountDetailService', CREDIT_ACCOUNT_DETAIL_SERVICE);
    this.mapApiDetailService.set('DebitAccountDetailService', DEBIT_ACCOUNT_DETAIL_SERVICE);
    this.mapApiDetailService.set('EquityAccountDetailService', EQUITY_ACCOUNT_DETAIL_SERVICE);

    this.mapApiDetailService.set('CreditEntryDetailService', CREDIT_ENTRY_DETAIL_SERVICE);
    this.mapApiDetailService.set('DebitEntryDetailService', DEBIT_ENTRY_DETAIL_SERVICE);
    this.mapApiDetailService.set('TransferEntryDetailService', TRANSFER_ENTRY_DETAIL_SERVICE);

    this.mapApiDetailService.set('OwnerDetailService', OWNER_DETAIL_SERVICE);
    this.mapApiDetailService.set('BalanceDetailService', BALANCE_DETAIL_SERVICE);
  }

  getBeanDetailService(typeName: string): BeanDetailService<T> {
    return inject(this.mapApiDetailService.get(`${typeName}DetailService`)!);
  }
}
