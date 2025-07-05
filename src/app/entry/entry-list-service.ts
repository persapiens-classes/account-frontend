import { HttpClient } from '@angular/common/http';
import { createEntry, Entry, jsonToEntry } from './entry';
import { InjectionToken } from '@angular/core';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { Observable } from 'rxjs';

export class EntryListService implements BeanListService<Entry> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  findAll(): Observable<Entry[]> {
    return findAllBeans(this.http, `${this.type.toLowerCase()}Entries`, createEntry, jsonToEntry);
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
