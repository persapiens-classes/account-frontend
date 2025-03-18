import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { createEntry, Entry, EntryInsertUpdate } from "./entry";

export class EntryService extends BeanService<Entry, EntryInsertUpdate, number> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Entry`, `${type.toLowerCase()}Entries`, createEntry)
  }

  override toBean(json: any): Entry {
    let result = super.toBean(json)
    result.date = new Date(result.date)
    return result
  }

}
