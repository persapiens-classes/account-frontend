import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ModelRemoveService {
  remove(id: string): Observable<void>;
}

export function removeModel(
  http: HttpClient,
  routerName: string,
  id: string,
  idSeparator: string,
): Observable<void> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http.delete<void>(`${apiUrl}${idSeparator}${id}`);
}
