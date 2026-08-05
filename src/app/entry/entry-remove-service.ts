import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';
import { EntryType } from './entry';

export class EntryRemoveService implements ModelRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: EntryType,
  ) {}

  remove(id: string): Observable<void> {
    return removeModel(this.http, `${this.type.toLowerCase()}Entries`, id, '/');
  }
}
