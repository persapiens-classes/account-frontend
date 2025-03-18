import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from '../../environments/environment';
import { Bean } from "./bean";

export class BeanService<T extends Bean<K>, B, K> {

  private apiUrl;

  constructor(private http: HttpClient,
    public beanName: string,
    public beansName: string,
    private createBeanFn: () => T) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }

  insert(bean: B): Observable<T> {
    return this.http.post<T>(this.apiUrl, bean).pipe(
      map(data => this.toBean(data))
    )
  }

  update(id: K, bean: B): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, bean).pipe(
      map(data => this.toBean(data))
    )
  }

  findAll(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.apiUrl).pipe(
      map(data => data.map(bean => this.toBean(bean)))
    )
  }

  findById(id: K): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`).pipe(
      map(data => this.toBean(data))
    )
  }

  remove(id: K): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  toBean(json: any): T {
    return Object.assign(this.createBeanFn(), json)
  }
}
