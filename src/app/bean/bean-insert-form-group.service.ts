import { Bean } from './bean';
import { FormBuilder, FormGroup } from '@angular/forms';

export class BeanInsertFormGroupService<T extends Bean> {
  public form!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private createFormFn: (formBuilder: FormBuilder) => FormGroup,
  ) {}

  public createForm(): FormGroup {
    this.form = this.createFormFn(this.formBuilder);
    return this.form;
  }
}
