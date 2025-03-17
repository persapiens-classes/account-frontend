import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Entry, EntryInsertUpdate } from "./entry";
import { Account } from "../account/account";

export class EntryService extends BeanService<Entry, EntryInsertUpdate, number> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`, createBean)
  }

}

function createBean(): Entry {
  return new Entry(0, '', '', new Date(), new Account('', ''), new Account('', ''), 0, '')
}