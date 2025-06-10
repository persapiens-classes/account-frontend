import { HttpClient } from '@angular/common/http';
import { createEntry, Entry, EntryInsertUpdate, jsonToEntry } from './entry';
import { InjectionToken } from '@angular/core';
import { BeanUpdateService } from '../bean/bean-update-service';

export class EntryUpdateService extends BeanUpdateService<Entry, EntryInsertUpdate> {
  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`, createEntry, jsonToEntry);
  }
}

export const CREDIT_ENTRY_UPDATE_SERVICE = new InjectionToken<EntryUpdateService>(
  'CreditEntryUpdateService',
);
export const DEBIT_ENTRY_UPDATE_SERVICE = new InjectionToken<EntryUpdateService>(
  'DebitEntryUpdateService',
);
export const TRANSFER_ENTRY_UPDATE_SERVICE = new InjectionToken<EntryUpdateService>(
  'TransferEntryUpdateService',
);
