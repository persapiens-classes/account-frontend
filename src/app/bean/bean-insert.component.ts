import { FormGroup } from '@angular/forms';

export class BeanInsertComponent<I> {
  constructor(public createBeanFn: (form: FormGroup) => I) {}
}
