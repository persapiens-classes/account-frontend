import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { BeanService } from './bean-service';
import { Bean } from './bean';

export class BeanListComponent<T extends Bean<I>, U, I> {
  beansList$: Observable<Array<T>>

  constructor(private router: Router,
    private messageService: MessageService,
    private beanService: BeanService<T, U, I>
  ) {
    this.beansList$ = this.beanService.findAll()
  }

  remove(item: T) {
    this.beanService.remove(item.getId()).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `${this.beanService.beanName} removed`,
          detail: `${this.beanService.beanName} removed ok.`
        })
        this.beansList$ = this.beanService.findAll()
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: `${this.beanService.beanName} not removed`,
          detail: `${this.beanService.beanName} not removed ${error.error.error}`
        })
        return of()
      })
    ).subscribe()
  }

  startInsert(): void {
    this.router.navigate([`${this.beanService.beansName}/new`])
  }

  startUpdate(item: T): void {
    this.router.navigate([`${this.beanService.beansName}/edit`], { state: { bean: item } })
  }
}
