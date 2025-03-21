import { Bean } from "./bean";
import { FormBuilder, FormGroup } from "@angular/forms";

export abstract class BeanFormGroupService<T extends Bean> {

  private form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formBuilder = formBuilder
  }

  protected abstract createForm(formBuilder: FormBuilder): FormGroup

  public getForm(): FormGroup {
    if (!this.form) {
      this.form = this.createForm(this.formBuilder)
    }

    return this.form
  }
}
