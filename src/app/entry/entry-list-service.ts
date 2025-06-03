import { HttpClient } from "@angular/common/http";
import { Entry, EntryInsertUpdate } from "./entry";
import { EntryCreateService } from "./entry-create-service";
import { InjectionToken } from "@angular/core";
import { BeanListService } from "../bean/bean-list-service";

export class EntryListService extends BeanListService<Entry> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type.toLowerCase()}Entries`, new EntryCreateService())
  }

}

export const CREDIT_ENTRY_LIST_SERVICE = new InjectionToken<EntryListService>('CreditEntryListService');
export const DEBIT_ENTRY_LIST_SERVICE = new InjectionToken<EntryListService>('DebitEntryListService');
export const TRANSFER_ENTRY_LIST_SERVICE = new InjectionToken<EntryListService>('TransferEntryListService');
