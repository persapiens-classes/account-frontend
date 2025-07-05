import { FormGroup } from '@angular/forms';

export interface BeanUpdateComponent<U> {
  createBean(form: FormGroup): U;
}
