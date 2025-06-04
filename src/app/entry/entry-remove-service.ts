import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { BeanRemoveService } from '../bean/bean-remove-service';

export class EntryRemoveService extends BeanRemoveService {
  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`);
  }
}

export const CREDIT_ENTRY_REMOVE_SERVICE = new InjectionToken<EntryRemoveService>(
  'CreditEntryRemoveService',
);
export const DEBIT_ENTRY_REMOVE_SERVICE = new InjectionToken<EntryRemoveService>(
  'DebitEntryRemoveService',
);
export const TRANSFER_ENTRY_REMOVE_SERVICE = new InjectionToken<EntryRemoveService>(
  'TransferEntryRemoveService',
);
