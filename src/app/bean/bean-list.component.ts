import { catchError, Observable, of } from 'rxjs';
import { Bean } from './bean';
import { BeanListService } from './bean-list-service';
import { AppMessageService } from '../app-message-service';

export class BeanListComponent<T extends Bean> {
  beansList$: Observable<T[]>;

  constructor(
    private readonly appMessageService: AppMessageService,
    public beanListService: BeanListService<T>,
    public readonly beanName: string,
    public readonly routerName: string,
  ) {
    this.beansList$ = this.loadBeans();
  }

  loadBeans(): Observable<T[]> {
    return this.beanListService.findAll().pipe(
      catchError((error) => {
        this.appMessageService.addErrorMessage(error, `${this.beanName} not listed`);
        return of();
      }),
    );
  }

  removed() {
    this.beansList$ = this.loadBeans();
  }
}
