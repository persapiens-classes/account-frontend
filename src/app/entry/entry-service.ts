import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Entry, EntryInsertUpdate } from "./entry";
import { EntryCreateService } from "./entry-create-service";

export class EntryService extends BeanService<Entry, EntryInsertUpdate, EntryInsertUpdate> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`, new EntryCreateService())
  }

}
