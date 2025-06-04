import { Bean } from './bean';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { BeanInsertService } from './bean-insert-service';
import {
  CREDIT_CATEGORY_INSERT_SERVICE,
  DEBIT_CATEGORY_INSERT_SERVICE,
  EQUITY_CATEGORY_INSERT_SERVICE,
} from '../category/category-insert-service';
import { OWNER_INSERT_SERVICE } from '../owner/owner-insert-service';
import {
  CREDIT_ACCOUNT_INSERT_SERVICE,
  DEBIT_ACCOUNT_INSERT_SERVICE,
  EQUITY_ACCOUNT_INSERT_SERVICE,
} from '../account/account-insert-service';
import {
  CREDIT_ENTRY_INSERT_SERVICE,
  DEBIT_ENTRY_INSERT_SERVICE,
  TRANSFER_ENTRY_INSERT_SERVICE,
} from '../entry/entry-insert-service';
import { OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_INSERT_SERVICE } from '../owner-equity-account-initial-value/owner-equity-account-initial-value-insert-service';

@Injectable({
  providedIn: 'root',
})
export class BeanInsertServiceFactory<T extends Bean, I> {
  mapApiInsertService: Map<string, InjectionToken<BeanInsertService<T, I>>>;

  constructor() {
    this.mapApiInsertService = new Map();
    this.mapApiInsertService.set('CreditCategoryInsertService', CREDIT_CATEGORY_INSERT_SERVICE);
    this.mapApiInsertService.set('DebitCategoryInsertService', DEBIT_CATEGORY_INSERT_SERVICE);
    this.mapApiInsertService.set('EquityCategoryInsertService', EQUITY_CATEGORY_INSERT_SERVICE);

    this.mapApiInsertService.set('CreditAccountInsertService', CREDIT_ACCOUNT_INSERT_SERVICE);
    this.mapApiInsertService.set('DebitAccountInsertService', DEBIT_ACCOUNT_INSERT_SERVICE);
    this.mapApiInsertService.set('EquityAccountInsertService', EQUITY_ACCOUNT_INSERT_SERVICE);

    this.mapApiInsertService.set('CreditEntryInsertService', CREDIT_ENTRY_INSERT_SERVICE);
    this.mapApiInsertService.set('DebitEntryInsertService', DEBIT_ENTRY_INSERT_SERVICE);
    this.mapApiInsertService.set('TransferEntryInsertService', TRANSFER_ENTRY_INSERT_SERVICE);

    this.mapApiInsertService.set('OwnerInsertService', OWNER_INSERT_SERVICE);
    this.mapApiInsertService.set(
      'OwnerEquityAccountInitialValueInsertService',
      OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_INSERT_SERVICE,
    );
  }

  getBeanInsertService(typeName: string): BeanInsertService<T, I> {
    return inject(this.mapApiInsertService.get(`${typeName}InsertService`)!);
  }
}
