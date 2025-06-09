import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean } from './bean';
import { BeanCreateService } from './bean-create-service';

export class BeanUpdateService<T extends Bean, U> {
  /* jscpd:ignore-start */
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    public beanName: string,
    public beansName: string,
    private readonly beanCreateService: BeanCreateService<T>,
  ) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }
  /* jscpd:ignore-end */

  idSeparator(): string {
    return '/';
  }

  update(id: string, bean: U): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}${this.idSeparator()}${id}`, bean)
      .pipe(map((data) => this.toBean(data)));
  }

  toBean(json: unknown): T {
    return this.beanCreateService.toBean(json);
  }
}
