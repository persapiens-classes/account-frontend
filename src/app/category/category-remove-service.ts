import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';
import { CategoryType } from './category';

export class CategoryRemoveService implements ModelRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: CategoryType,
  ) {}

  remove(id: string): Observable<void> {
    return removeModel(this.http, `${this.type.toLowerCase()}Categories`, id, '/');
  }
}
