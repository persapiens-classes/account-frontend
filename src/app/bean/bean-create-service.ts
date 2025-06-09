import { Bean } from './bean';

export class BeanCreateService<T extends Bean> {
  constructor(private readonly createBeanFn: () => T) {}

  toBean(json: unknown): T {
    return Object.assign(this.createBeanFn(), json);
  }
}
