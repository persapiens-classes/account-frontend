import { Bean, toBean } from './bean';

export class BeanDetailComponent<T extends Bean> {
  bean: T;

  constructor(
    private readonly beanCreateFunction: () => T,
    private readonly jsonToBeanFunction: (t: T) => T,
  ) {
    this.bean = this.toBean(history.state.bean);
  }

  toBean(json: unknown): T {
    return toBean(json, this.beanCreateFunction, this.jsonToBeanFunction);
  }
}
