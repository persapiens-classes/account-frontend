import { Bean } from "./bean";
import { FormBuilder, FormGroup } from "@angular/forms";

export abstract class BeanInsertFormGroupService<T extends Bean> {

  public form!: FormGroup;

  constructor(public formBuilder: FormBuilder) {
  }

  protected abstract doCreateForm(): FormGroup

  public createForm(): FormGroup {
    this.form = this.doCreateForm();
    return this.form
  }
}
