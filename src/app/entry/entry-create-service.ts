import { BeanCreateService } from '../bean/bean-create-service';
import { Injectable } from '@angular/core';
import { createEntry, Entry } from './entry';

@Injectable({
  providedIn: 'root',
})
export class EntryCreateService extends BeanCreateService<Entry> {
  constructor() {
    super(createEntry);
  }

  override toBean(json: any): Entry {
    const result = super.toBean(json);
    result.date = new Date(result.date);
    return result;
  }
}
