import { HttpClient } from '@angular/common/http';
import { BeanRemoveService, removeBean } from '../bean/bean-remove-service';
import { Observable } from 'rxjs';

export class CategoryRemoveService implements BeanRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  remove(id: string): Observable<void> {
    return removeBean(this.http, `${this.type.toLowerCase()}Categories`, id, '/');
  }
}
