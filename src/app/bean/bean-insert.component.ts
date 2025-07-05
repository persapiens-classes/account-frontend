import { FormGroup } from '@angular/forms';

export interface BeanInsertComponent<I> {
  createBean(form: FormGroup): I;
}
