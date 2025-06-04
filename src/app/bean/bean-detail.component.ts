import { Bean } from './bean';
import { BeanCreateService } from './bean-create-service';

export class BeanDetailComponent<T extends Bean> {
  bean: T;

  constructor(beanCreateService: BeanCreateService<T>) {
    this.bean = beanCreateService.toBean(history.state.bean);
  }
}
