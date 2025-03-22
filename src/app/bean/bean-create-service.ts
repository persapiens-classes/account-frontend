import { Bean } from "./bean";

export class BeanCreateService<T extends Bean> {

  constructor(private createBeanFn: () => T) {
  }

  toBean(json: any): T {
    return Object.assign(this.createBeanFn(), json)
  }
}
