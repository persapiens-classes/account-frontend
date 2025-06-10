import { HttpClient } from '@angular/common/http';
import { BeanInsertService } from '../bean/bean-insert-service';
import { createEntry, Entry, EntryInsertUpdate, jsonToEntry } from './entry';
import { InjectionToken } from '@angular/core';

export class EntryInsertService extends BeanInsertService<Entry, EntryInsertUpdate> {
  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`, createEntry, jsonToEntry);
  }
}

export const CREDIT_ENTRY_INSERT_SERVICE = new InjectionToken<EntryInsertService>(
  'CreditEntryInsertService',
);
export const DEBIT_ENTRY_INSERT_SERVICE = new InjectionToken<EntryInsertService>(
  'DebitEntryInsertService',
);
export const TRANSFER_ENTRY_INSERT_SERVICE = new InjectionToken<EntryInsertService>(
  'TransferEntryInsertService',
);
