import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { BeanRemoveService, removeBean } from '../bean/bean-remove-service';
import { Observable } from 'rxjs';

export class EntryRemoveService implements BeanRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  remove(id: string): Observable<void> {
    return removeBean(this.http, `${this.type.toLowerCase()}Entries`, id, '/');
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
