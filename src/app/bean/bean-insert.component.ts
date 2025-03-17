import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { BeanService } from './bean-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bean } from './bean';

export class BeanInsertComponent<T extends Bean<I>, U, I> {
  form: FormGroup

  constructor(
    private router: Router,
    private messageService: MessageService,
    formBuilder: FormBuilder,
    private beanService: BeanService<T, U, I>,
    createFormFn: (formBuilder: FormBuilder) => FormGroup,
    private createBeanFn: (form: FormGroup) => U,
  ) {
    this.form = createFormFn(formBuilder)
  }

  insert() {
    if (this.form.valid) {
      const newBean = this.createBeanFn(this.form)
      console.log(newBean)

      this.beanService.insert(newBean).pipe(
        tap((bean) => {
          this.messageService.add({
            severity: 'success',
            summary: `${this.beanService.beanName} inserted`,
            detail: `${this.beanService.beanName} ${bean.getId()} inserted ok.`
          })
          this.router.navigate([`${this.beanService.beansName}`])
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: `${this.beanService.beanName} not inserted`,
            detail: `${this.beanService.beanName} not inserted: ${error.error.error}`
          })
          return of()
        })
      ).subscribe()
    }
  }

  cancelInsert() {
    this.router.navigate([`${this.beanService.beansName}`])
  }
}
