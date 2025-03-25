import { catchError, Observable, of } from 'rxjs';
import { Bean } from './bean';
import { BeanService } from './bean-service';
import { AppMessageService } from '../app-message-service';

export class BeanListComponent<T extends Bean, I, U> {
  beansList$: Observable<Array<T>>

  constructor(private appMessageService: AppMessageService,
    public beanService: BeanService<T, I, U>
  ) {
    this.beansList$ = this.loadBeans()
  }

  loadBeans(): Observable<Array<T>> {
    return this.beanService.findAll().pipe(
      catchError((error) => {
        this.appMessageService.addErrorMessage(error,
          `${this.beanService.beansName} not listed`)
        return of()
      })
    )
  }

  removed() {
    this.beansList$ = this.loadBeans()
  }

}
