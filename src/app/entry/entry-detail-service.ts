import { InjectionToken } from '@angular/core';
import { BeanDetailService } from '../bean/bean-detail-service';

export class EntryDetailService extends BeanDetailService {
  constructor(type: string) {
    super(`${type.toLowerCase()}Entries`);
  }
}

export const CREDIT_ENTRY_DETAIL_SERVICE = new InjectionToken<EntryDetailService>(
  'CreditEntryDetailService',
);
export const DEBIT_ENTRY_DETAIL_SERVICE = new InjectionToken<EntryDetailService>(
  'DebitEntryDetailService',
);
export const TRANSFER_ENTRY_DETAIL_SERVICE = new InjectionToken<EntryDetailService>(
  'TransferEntryDetailService',
);
