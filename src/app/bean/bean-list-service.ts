import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean } from './bean';
import { BeanCreateService } from './bean-create-service';

export class BeanListService<T extends Bean> {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    public beansName: string,
    private beanCreateService: BeanCreateService<T>,
  ) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }

  findAll(): Observable<T[]> {
    return this.http
      .get<T[]>(this.apiUrl)
      .pipe(map((data) => data.map((bean) => this.toBean(bean))));
  }

  toBean(json: any): T {
    return this.beanCreateService.toBean(json);
  }
}
