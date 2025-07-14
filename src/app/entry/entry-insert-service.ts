import { HttpClient } from '@angular/common/http';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { createEntry, Entry, EntryInsertUpdate, jsonToEntry } from './entry';
import { Observable } from 'rxjs';

export class EntryInsertService implements BeanInsertService<Entry, EntryInsertUpdate> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  insert(entry: EntryInsertUpdate): Observable<Entry> {
    return insertBean(
      entry,
      this.http,
      `${this.type.toLowerCase()}Entries`,
      createEntry,
      jsonToEntry,
    );
  }
}
