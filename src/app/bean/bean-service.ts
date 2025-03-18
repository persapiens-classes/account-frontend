import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from '../../environments/environment';
import { Bean } from "./bean";

export class BeanService<T extends Bean, I, U> {

  private apiUrl;

  constructor(private http: HttpClient,
    public beanName: string,
    public beansName: string,
    private createBeanFn: () => T) {
    this.apiUrl = environment.apiUrl + '/' + beansName;
  }

  insert(bean: I): Observable<T> {
    return this.http.post<T>(this.apiUrl, bean).pipe(
      map(data => this.toBean(data))
    )
  }

  idSeparator(): string {
    return '/'
  }

  update(id: string, bean: U): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${this.idSeparator()}${id}`, bean).pipe(
      map(data => this.toBean(data))
    )
  }

  findAll(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.apiUrl).pipe(
      map(data => data.map(bean => this.toBean(bean)))
    )
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.idSeparator()}${id}`)
  }

  toBean(json: any): T {
    return Object.assign(this.createBeanFn(), json)
  }
}
