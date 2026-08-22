import { HttpClient } from '@angular/common/http';
import { ModelInsertService, insertModel } from '../models/model-insert-service';
import { Entry, EntryInsertUpdate, EntryType } from './entry';
import { Observable } from 'rxjs';

export class EntryInsertService implements ModelInsertService<Entry, EntryInsertUpdate> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: EntryType,
  ) {}

  insert(entry: EntryInsertUpdate): Observable<Entry> {
    return insertModel(entry, this.http, `${this.type.toLowerCase()}Entries`);
  }
}
