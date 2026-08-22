import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';
import { EntryType } from './entry';
import { API_PATHS } from '../app.api-paths';

export class EntryRemoveService implements ModelRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: EntryType,
  ) {}

  remove(id: string): Observable<void> {
    return removeModel(this.http, `${this.type.toLowerCase()}${API_PATHS.ENTRY_API_PATH}`, id, '/');
  }
}
