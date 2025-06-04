import { Account, createAccount } from './account';
import { BeanCreateService } from '../bean/bean-create-service';

export class AccountCreateService extends BeanCreateService<Account> {
  constructor() {
    super(createAccount);
  }
}
