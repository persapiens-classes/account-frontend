import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean, toBean } from './bean';

export class BeanInsertService<T extends Bean, I> {
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    public beanName: string,
    public beansName: string,
    private readonly beanCreateFunction: () => T,
    private readonly jsonToBeanFunction: (t: T) => T,
  ) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }

  insert(bean: I): Observable<T> {
    return this.http.post<T>(this.apiUrl, bean).pipe(map((data) => this.toBean(data)));
  }

  toBean(json: unknown): T {
    return toBean(json, this.beanCreateFunction, this.jsonToBeanFunction);
  }
}
