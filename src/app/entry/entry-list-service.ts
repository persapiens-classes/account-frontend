import { createEntry, Entry, jsonToEntry } from './entry';
import { BeanListService, loadBeans } from '../bean/bean-list-service';
import { WritableSignal } from '@angular/core';
import { AppMessageService } from '../app-message-service';

export class EntryListService implements BeanListService<Entry> {
  constructor(
    private readonly appMessageService: AppMessageService,
    private readonly type: string,
  ) {}

  findAll(): WritableSignal<Entry[]> {
    return loadBeans(
      this.appMessageService,
      `${this.type} Entry`,
      `${this.type.toLowerCase()}Entries`,
      createEntry,
      jsonToEntry,
    );
  }
}
