import { HttpClient } from '@angular/common/http';
import { createEntry, Entry, EntryInsertUpdate, jsonToEntry } from './entry';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { Observable } from 'rxjs';

export class EntryUpdateService implements BeanUpdateService<Entry, EntryInsertUpdate> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  update(id: string, entry: Entry): Observable<Entry> {
    return updateBean(
      entry,
      this.http,
      `${this.type.toLowerCase()}Entries`,
      id,
      '/',
      createEntry,
      jsonToEntry,
    );
  }
}
