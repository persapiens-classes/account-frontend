import { BeanService } from './bean-service';
import { Bean } from './bean';
import { FormGroup } from '@angular/forms';

export class BeanUpdateComponent<T extends Bean, I, U> {
  constructor(public beanService: BeanService<T, I, U>,
    public createBeanFn: (form: FormGroup) => U) {
  }

}
