import { HttpClient } from '@angular/common/http';
import { BeanRemoveService, removeBean } from '../bean/bean-remove-service';
import { Observable } from 'rxjs';
import { EntryType } from './entry';

export class EntryRemoveService implements BeanRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: EntryType,
  ) {}

  remove(id: string): Observable<void> {
    return removeBean(this.http, `${this.type.toLowerCase()}Entries`, id, '/');
  }
}
