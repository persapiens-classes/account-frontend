import { Bean, toBean } from './bean';

export class BeanDetailComponent<T extends Bean> {
  bean: T;

  constructor(beanCreateFunction: () => T, jsonToBeanFunction: (t: T) => T) {
    this.bean = toBean(history.state.bean, beanCreateFunction, jsonToBeanFunction);
  }
}
