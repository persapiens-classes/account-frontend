import { BeanCreateService } from '../bean/bean-create-service';
import { createBalance, Balance } from './balance';

export class BalanceCreateService extends BeanCreateService<Balance> {
  constructor() {
    super(createBalance);
  }
}
