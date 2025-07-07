import { Bean, toBean } from './bean';
import { FormBuilder, FormGroup } from '@angular/forms';

export class BeanUpdateFormGroupService<T extends Bean> {
  private form!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly beanCreateFunction: () => T,
    private readonly jsonToBeanFunction: (t: T) => T,
    private createFormFn: (formBuilder: FormBuilder, bean: T) => FormGroup,
  ) {}

  public getBeanFromHistory(): T {
    return toBean(history.state.bean, this.beanCreateFunction, this.jsonToBeanFunction);
  }

  public getForm(): FormGroup {
    const bean = this.getBeanFromHistory();
    if (this.form == null) {
      this.form = this.createFormFn(this.formBuilder, bean);
    }
    return this.form;
  }
}
