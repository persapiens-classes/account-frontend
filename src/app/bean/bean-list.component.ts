import { catchError, Observable, of } from 'rxjs';
import { Bean } from './bean';
import { BeanService } from './bean-service';
import { addMessageService } from '../parse-http-error';
import { MessageService } from 'primeng/api';

export class BeanListComponent<T extends Bean, I, U> {
  beansList$: Observable<Array<T>>

  constructor(private messageService: MessageService,
    public beanService: BeanService<T, I, U>
  ) {
    this.beansList$ = this.loadBeans()
  }

  loadBeans(): Observable<Array<T>> {
    return this.beanService.findAll().pipe(
      catchError((error) => {
        addMessageService(this.messageService, error,
          `${this.beanService.beansName} not listed`)
        return of()
      })
    )
  }

  removed() {
    this.beansList$ = this.loadBeans()
  }

}
