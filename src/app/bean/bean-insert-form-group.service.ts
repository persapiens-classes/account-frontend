import { FormBuilder, FormGroup } from '@angular/forms';

export class BeanInsertFormGroupService {
  public form!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private readonly createFormFn: (formBuilder: FormBuilder) => FormGroup,
  ) {}

  public createForm(): FormGroup {
    this.form = this.createFormFn(this.formBuilder);
    return this.form;
  }
}
