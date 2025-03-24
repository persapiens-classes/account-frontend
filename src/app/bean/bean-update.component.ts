import { FormGroup } from '@angular/forms';

export class BeanUpdateComponent<U> {
  constructor(
    public createBeanFn: (form: FormGroup) => U) {
  }

}
