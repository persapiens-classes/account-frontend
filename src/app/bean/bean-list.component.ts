import { catchError, Observable, of } from 'rxjs';
import { Bean } from './bean';
import { BeanListService } from './bean-list-service';
import { AppMessageService } from '../app-message-service';

export class BeanListComponent<T extends Bean> {
  beansList$: Observable<Array<T>>;

  constructor(
    private appMessageService: AppMessageService,
    public beanListService: BeanListService<T>,
  ) {
    this.beansList$ = this.loadBeans();
  }

  loadBeans(): Observable<Array<T>> {
    return this.beanListService.findAll().pipe(
      catchError((error) => {
        this.appMessageService.addErrorMessage(
          error,
          `${this.beanListService.beansName} not listed`,
        );
        return of();
      }),
    );
  }

  removed() {
    this.beansList$ = this.loadBeans();
  }
}
