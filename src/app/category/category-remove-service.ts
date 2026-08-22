import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';
import { CategoryType } from './category';
import { API_PATHS } from '../app.api-paths';

export class CategoryRemoveService implements ModelRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: CategoryType,
  ) {}

  remove(id: string): Observable<void> {
    return removeModel(
      this.http,
      `${this.type.toLowerCase()}${API_PATHS.CATEGORY_API_PATH}`,
      id,
      '/',
    );
  }
}
