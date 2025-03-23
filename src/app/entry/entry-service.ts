import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Entry, EntryInsertUpdate } from "./entry";
import { EntryCreateService } from "./entry-create-service";
import { InjectionToken } from "@angular/core";

export class EntryService extends BeanService<Entry, EntryInsertUpdate, EntryInsertUpdate> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`, new EntryCreateService())
  }

}

export const CREDIT_ENTRY_SERVICE = new InjectionToken<EntryService>('CreditEntryService');
export const DEBIT_ENTRY_SERVICE = new InjectionToken<EntryService>('DebitEntryService');
export const TRANSFER_ENTRY_SERVICE = new InjectionToken<EntryService>('TransferEntryService');
