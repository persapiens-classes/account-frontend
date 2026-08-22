import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ModelInsertService<T, I> {
  insert(model: I): Observable<T>;
}

export function insertModel<T, I>(model: I, http: HttpClient, routerName: string): Observable<T> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http.post<T>(apiUrl, model);
}
