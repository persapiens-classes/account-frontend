import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export class BeanRemoveService {
  private apiUrl;

  constructor(
    private readonly http: HttpClient,
    public beanName: string,
    public beansName: string,
  ) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }

  idSeparator(): string {
    return '/';
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.idSeparator()}${id}`);
  }
}
