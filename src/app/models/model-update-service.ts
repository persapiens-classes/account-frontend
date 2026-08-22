import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ModelUpdateService<T, U> {
  update(id: string, model: U): Observable<T>;
}

export function updateModel<T, U>(
  model: U,
  http: HttpClient,
  routerName: string,
  id: string,
  idSeparator: string,
): Observable<T> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http.put<T>(`${apiUrl}${idSeparator}${id}`, model);
}
