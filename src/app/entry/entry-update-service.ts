import { HttpClient } from "@angular/common/http";
import { Entry, EntryInsertUpdate } from "./entry";
import { EntryCreateService } from "./entry-create-service";
import { InjectionToken } from "@angular/core";
import { BeanUpdateService } from "../bean/bean-update-service";

export class EntryUpdateService extends BeanUpdateService<Entry, EntryInsertUpdate> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`, new EntryCreateService())
  }

}

export const CREDIT_ENTRY_UPDATE_SERVICE = new InjectionToken<EntryUpdateService>('CreditEntryUpdateService');
export const DEBIT_ENTRY_UPDATE_SERVICE = new InjectionToken<EntryUpdateService>('DebitEntryUpdateService');
export const TRANSFER_ENTRY_UPDATE_SERVICE = new InjectionToken<EntryUpdateService>('TransferEntryUpdateService');
