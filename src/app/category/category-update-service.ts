import { HttpClient } from '@angular/common/http';
import { ModelUpdateService, updateModel } from '../models/model-update-service';
import { Category, CategoryType } from './category';
import { Observable } from 'rxjs';
import { API_PATHS } from '../app.api-paths';

export class CategoryUpdateService implements ModelUpdateService<Category, Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: CategoryType,
  ) {}

  update(id: string, category: Category): Observable<Category> {
    return updateModel(
      category,
      this.http,
      `${this.type.toLowerCase()}${API_PATHS.CATEGORY_API_PATH}`,
      id,
      '/',
    );
  }
}
