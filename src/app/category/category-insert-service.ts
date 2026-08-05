import { HttpClient } from '@angular/common/http';
import { ModelInsertService, insertModel } from '../models/model-insert-service';
import { Category, CategoryType } from './category';
import { Observable } from 'rxjs';

export class CategoryInsertService implements ModelInsertService<Category, Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: CategoryType,
  ) {}

  insert(category: Category): Observable<Category> {
    return insertModel(category, this.http, `${this.type.toLowerCase()}Categories`);
  }
}
