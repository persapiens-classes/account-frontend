import { Bean } from "./bean";
import { BeanCreateService } from "./bean-create-service";

export class BeanDetailService<T extends Bean> {

  constructor(
    public beansName: string,
    public beanCreateService: BeanCreateService<T>) {
  }

}
