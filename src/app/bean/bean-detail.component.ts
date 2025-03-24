import { Bean } from './bean';
import { BeanCreateService } from './bean-create-service';

export class BeanDetailComponent<T extends Bean, I, U> {
  bean: T

  constructor(
    beanService: BeanCreateService<T>
  ) {
    this.bean = beanService.toBean(history.state.bean)
  }

}
