import { BeanCreateService } from '../bean/bean-create-service';
import { createOwner, Owner } from './owner';

export class OwnerCreateService extends BeanCreateService<Owner> {
  constructor() {
    super(createOwner);
  }
}
