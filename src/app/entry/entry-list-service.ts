import { HttpClient } from '@angular/common/http';
import { createEntry, Entry, jsonToEntry } from './entry';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { Observable } from 'rxjs';

export class EntryListService implements BeanListService<Entry> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  findAll(): Observable<Entry[]> {
    return findAllBeans(this.http, `${this.type.toLowerCase()}Entries`, createEntry, jsonToEntry);
  }
}
