import { HttpClient } from '@angular/common/http';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { Category, createCategory } from './category';
import { Observable } from 'rxjs';

export class CategoryUpdateService implements BeanUpdateService<Category, Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  update(id: string, category: Category): Observable<Category> {
    return updateBean(
      category,
      this.http,
      `${this.type.toLowerCase()}Categories`,
      id,
      '/',
      createCategory,
    );
  }
}
