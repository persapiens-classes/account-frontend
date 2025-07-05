import { HttpClient } from '@angular/common/http';
import { createEntry, Entry, EntryInsertUpdate, jsonToEntry } from './entry';
import { InjectionToken } from '@angular/core';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { Observable } from 'rxjs';

export class EntryUpdateService implements BeanUpdateService<Entry, EntryInsertUpdate> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  update(id: string, entry: Entry): Observable<Entry> {
    return updateBean(
      this.http,
      `${this.type.toLowerCase()}Entries`,
      createEntry,
      jsonToEntry,
      id,
      '/',
      entry,
    );
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
