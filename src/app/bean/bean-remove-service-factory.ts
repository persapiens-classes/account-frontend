import { Bean } from './bean';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { BeanRemoveService } from './bean-remove-service';
import {
  CREDIT_CATEGORY_REMOVE_SERVICE,
  DEBIT_CATEGORY_REMOVE_SERVICE,
  EQUITY_CATEGORY_REMOVE_SERVICE,
} from '../category/category-remove-service';
import { OWNER_REMOVE_SERVICE } from '../owner/owner-remove-service';
import {
  CREDIT_ACCOUNT_REMOVE_SERVICE,
  DEBIT_ACCOUNT_REMOVE_SERVICE,
  EQUITY_ACCOUNT_REMOVE_SERVICE,
} from '../account/account-remove-service';
import {
  CREDIT_ENTRY_REMOVE_SERVICE,
  DEBIT_ENTRY_REMOVE_SERVICE,
  TRANSFER_ENTRY_REMOVE_SERVICE,
} from '../entry/entry-remove-service';
import { OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_REMOVE_SERVICE } from '../owner-equity-account-initial-value/owner-equity-account-initial-value-remove-service';

@Injectable({
  providedIn: 'root',
})
export class BeanRemoveServiceFactory<T extends Bean> {
  mapApiRemoveService: Map<string, InjectionToken<BeanRemoveService<T>>>;

  constructor() {
    this.mapApiRemoveService = new Map();
    this.mapApiRemoveService.set('CreditCategoryRemoveService', CREDIT_CATEGORY_REMOVE_SERVICE);
    this.mapApiRemoveService.set('DebitCategoryRemoveService', DEBIT_CATEGORY_REMOVE_SERVICE);
    this.mapApiRemoveService.set('EquityCategoryRemoveService', EQUITY_CATEGORY_REMOVE_SERVICE);

    this.mapApiRemoveService.set('CreditAccountRemoveService', CREDIT_ACCOUNT_REMOVE_SERVICE);
    this.mapApiRemoveService.set('DebitAccountRemoveService', DEBIT_ACCOUNT_REMOVE_SERVICE);
    this.mapApiRemoveService.set('EquityAccountRemoveService', EQUITY_ACCOUNT_REMOVE_SERVICE);

    this.mapApiRemoveService.set('CreditEntryRemoveService', CREDIT_ENTRY_REMOVE_SERVICE);
    this.mapApiRemoveService.set('DebitEntryRemoveService', DEBIT_ENTRY_REMOVE_SERVICE);
    this.mapApiRemoveService.set('TransferEntryRemoveService', TRANSFER_ENTRY_REMOVE_SERVICE);

    this.mapApiRemoveService.set('OwnerRemoveService', OWNER_REMOVE_SERVICE);
    this.mapApiRemoveService.set(
      'OwnerEquityAccountInitialValueRemoveService',
      OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_REMOVE_SERVICE,
    );
  }

  getBeanRemoveService(typeName: string): BeanRemoveService<T> {
    return inject(this.mapApiRemoveService.get(`${typeName}RemoveService`)!);
  }
}
