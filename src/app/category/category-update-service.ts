import { HttpClient } from '@angular/common/http';
import { ModelUpdateService, updateModel } from '../models/model-update-service';
import { Category, CategoryType } from './category';
import { Observable } from 'rxjs';

export class CategoryUpdateService implements ModelUpdateService<Category, Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: CategoryType,
  ) {}

  update(id: string, category: Category): Observable<Category> {
    return updateModel(category, this.http, `${this.type.toLowerCase()}Categories`, id, '/');
  }
}
