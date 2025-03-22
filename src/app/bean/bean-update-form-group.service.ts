import { Bean } from "./bean";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BeanCreateService } from "./bean-create-service";

export abstract class BeanUpdateFormGroupService<T extends Bean> {

  public form!: FormGroup;

  constructor(public formBuilder: FormBuilder,
    private beanCreateService: BeanCreateService<T>) {
  }

  protected abstract doCreateForm(bean: T): FormGroup

  public createBeanFromHistory(): T {
    return this.beanCreateService.toBean(history.state.bean)
  }

  public createForm(bean: T): FormGroup {
    this.form = this.doCreateForm(bean);
    return this.form
  }
}
