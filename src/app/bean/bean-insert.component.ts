import { BeanService } from './bean-service';
import { Bean } from './bean';

export abstract class BeanInsertComponent<T extends Bean, I, U> {
  constructor (public beanService: BeanService<T, I, U>) {
  }

  abstract createBean(): I 
}
