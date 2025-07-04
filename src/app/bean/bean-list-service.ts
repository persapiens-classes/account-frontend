import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean, toBean } from './bean';

export class BeanListService<T extends Bean> {
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    public beansName: string,
    private readonly beanCreateFunction: () => T,
    private readonly jsonToBeanFunction: (t: T) => T,
  ) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }

  findAll(): Observable<T[]> {
    return this.http
      .get<T[]>(this.apiUrl)
      .pipe(map((data) => data.map((bean) => this.toBean(bean))));
  }

  toBean(json: unknown): T {
    return toBean(json, this.beanCreateFunction, this.jsonToBeanFunction);
  }
}
