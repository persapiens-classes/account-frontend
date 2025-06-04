import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean } from './bean';
import { BeanCreateService } from './bean-create-service';

export class BeanInsertService<T extends Bean, I> {
  private apiUrl;

  constructor(
    private http: HttpClient,
    public beanName: string,
    public beansName: string,
    private beanCreateService: BeanCreateService<T>,
  ) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }

  insert(bean: I): Observable<T> {
    return this.http.post<T>(this.apiUrl, bean).pipe(map((data) => this.toBean(data)));
  }

  toBean(json: any): T {
    return this.beanCreateService.toBean(json);
  }
}
