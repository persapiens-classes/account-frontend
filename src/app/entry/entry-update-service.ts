import { HttpClient } from '@angular/common/http';
import { Entry, EntryInsertUpdate, EntryType } from './entry';
import { ModelUpdateService, updateModel } from '../models/model-update-service';
import { Observable } from 'rxjs';
import { API_PATHS } from '../app.api-paths';

export class EntryUpdateService implements ModelUpdateService<Entry, EntryInsertUpdate> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: EntryType,
  ) {}

  update(id: string, entry: EntryInsertUpdate): Observable<Entry> {
    return updateModel(
      entry,
      this.http,
      `${this.type.toLowerCase()}${API_PATHS.ENTRY_API_PATH}`,
      id,
      '/',
    );
  }
}
