import { Router } from '@angular/router';
import { Bean } from './bean';
import { BeanService } from './bean-service';

export class BeanDetailComponent<T extends Bean, I, U> {
  bean: T

  constructor(
    private router: Router,
    private beanService: BeanService<T, I, U>
  ) {
    this.bean = this.beanService.toBean(history.state.bean)
    if (!this.bean) {
      this.router.navigate([`${this.beanService.beansName}`])
    }
  }

  list() {
    this.router.navigate([`${this.beanService.beansName}`])
  }

  startUpdate() {
    this.router.navigate([`${this.beanService.beansName}/edit`], { state: { bean: this.bean } })
  }

}
