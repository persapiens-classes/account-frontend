import { HttpClient } from '@angular/common/http';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { Category, CategoryType, createCategory } from './category';
import { Observable } from 'rxjs';

export class CategoryInsertService implements BeanInsertService<Category, Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: CategoryType,
  ) {}

  insert(category: Category): Observable<Category> {
    return insertBean(category, this.http, `${this.type.toLowerCase()}Categories`, createCategory);
  }
}
