import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { BeanService } from './bean-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bean } from './bean';

export class BeanUpdateComponent<T extends Bean, I, U> {
  form: FormGroup
  bean: T

  constructor(
    private router: Router,
    private messageService: MessageService,
    formBuilder: FormBuilder,
    private beanService: BeanService<T, I, U>,
    createFormFn: (formBuilder: FormBuilder, bean: T) => FormGroup,
    private createBeanFn: (form: FormGroup) => U
  ) {
    this.bean = this.beanService.toBean(history.state.bean)
    if (!this.bean) {
      this.router.navigate([`${this.beanService.beansName}`])
    }

    this.form = createFormFn(formBuilder, this.bean)
  }

  update() {
    if (this.form.valid) {
      const updatedBean = this.createBeanFn(this.form)

      this.beanService.update(this.bean.getId(), updatedBean).pipe(
        tap((bean) => {
          this.messageService.add({
            severity: 'success',
            summary: `${this.beanService.beanName} edited`,
            detail: `${this.beanService.beanName} ${this.bean.getId()} edited ok.`
          })
          this.router.navigate([`${this.beanService.beansName}`])
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: `${this.beanService.beanName} not edited`,
            detail: `${this.beanService.beanName} not edited: ${error.error.error}`
          })
          return of()
        })
      ).subscribe()
    }
  }

  cancelUpdate() {
    this.router.navigate([`${this.beanService.beansName}`])
  }
}
