import { HttpClient } from '@angular/common/http';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { createEntry, Entry, EntryInsertUpdate, jsonToEntry } from './entry';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export class EntryInsertService implements BeanInsertService<Entry, EntryInsertUpdate> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  insert(entry: EntryInsertUpdate): Observable<Entry> {
    return insertBean(
      this.http,
      `${this.type.toLowerCase()}Entries`,
      createEntry,
      jsonToEntry,
      entry,
    );
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
