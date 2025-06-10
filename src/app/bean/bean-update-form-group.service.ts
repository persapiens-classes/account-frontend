import { Bean, toBean } from './bean';
import { FormBuilder, FormGroup } from '@angular/forms';

export class BeanUpdateFormGroupService<T extends Bean> {
  public form!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    readonly beanCreateFunction: () => T,
    readonly jsonToBeanFunction: (t: T) => T,
    public createFormFn: (formBuilder: FormBuilder, bean: T) => FormGroup,
  ) {}

  public createBeanFromHistory(): T {
    return toBean(history.state.bean, this.beanCreateFunction, this.jsonToBeanFunction);
  }

  public createForm(bean: T): FormGroup {
    this.form = this.createFormFn(this.formBuilder, bean);
    return this.form;
  }
}
