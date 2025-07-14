import { Bean, toBeanFromHistory } from './bean';
import { FormBuilder, FormGroup } from '@angular/forms';

export class BeanUpdateFormGroupService<T extends Bean> {
  private form!: FormGroup;
  private bean!: T;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly beanCreateFunction: () => T,
    private readonly jsonToBeanFunction: (t: T) => T,
    private readonly createFormFn: (formBuilder: FormBuilder, bean: T) => FormGroup,
  ) {}

  public getBeanFromHistory(): T {
    this.bean ??= toBeanFromHistory(this.beanCreateFunction, this.jsonToBeanFunction);
    return this.bean;
  }

  public getForm(): FormGroup {
    this.form ??= this.createFormFn(this.formBuilder, this.getBeanFromHistory());
    return this.form;
  }
}
