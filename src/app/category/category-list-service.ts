import { HttpClient } from '@angular/common/http';
import { Category, createCategory } from './category';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { Observable } from 'rxjs';

export class CategoryListService implements BeanListService<Category> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  findAll(): Observable<Category[]> {
    return findAllBeans(this.http, `${this.type.toLowerCase()}Categories`, createCategory);
  }
}
