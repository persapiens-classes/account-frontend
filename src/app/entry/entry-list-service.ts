import { HttpClient } from '@angular/common/http';
import { createEntry, Entry, jsonToEntry } from './entry';
import { InjectionToken } from '@angular/core';
import { BeanListService } from '../bean/bean-list-service';

export class EntryListService extends BeanListService<Entry> {
  constructor(http: HttpClient, type: string) {
    super(http, `${type.toLowerCase()}Entries`, createEntry, jsonToEntry);
  }
}

export const CREDIT_ENTRY_LIST_SERVICE = new InjectionToken<EntryListService>(
  'CreditEntryListService',
);
export const DEBIT_ENTRY_LIST_SERVICE = new InjectionToken<EntryListService>(
  'DebitEntryListService',
);
export const TRANSFER_ENTRY_LIST_SERVICE = new InjectionToken<EntryListService>(
  'TransferEntryListService',
);
