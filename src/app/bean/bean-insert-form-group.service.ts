import { FormBuilder, FormGroup } from '@angular/forms';

export class BeanInsertFormGroupService {
  private form!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly createFormFn: (formBuilder: FormBuilder) => FormGroup,
  ) {}

  public getForm(): FormGroup {
    this.form ??= this.createFormFn(this.formBuilder);
    return this.form;
  }
}
