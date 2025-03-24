import { Observable } from 'rxjs';
import { Bean } from './bean';
import { BeanService } from './bean-service';

export class BeanListComponent<T extends Bean, I, U> {
  beansList$: Observable<Array<T>>

  constructor(public beanService: BeanService<T, I, U>) {
    this.beansList$ = this.beanService.findAll()
  }

  removed() {
    this.beansList$ = this.beanService.findAll()
  }

}
