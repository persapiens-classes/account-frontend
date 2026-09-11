import { Service } from '@angular/core';
import { Category } from '../category/category';
import { Owner } from '../owner/owner';
import { Balance } from '../balance/balance';
import { Account } from '../account/account';
import { Entry } from '../entry/entry';
import { OwnerEquityAccountInitialValue } from '../balance/owner-equity-account-initial-value';

export class StateTransferService<T> {
  private state: T | null = null;

  setState(state: T): void {
    this.state = state;
  }

  getState(): T | null {
    return this.state;
  }
}

@Service()
export class OwnerStateTransferService extends StateTransferService<Owner> {}

@Service()
export class CategoryStateTransferService extends StateTransferService<Category> {}

@Service()
export class AccountStateTransferService extends StateTransferService<Account> {}

@Service()
export class BalanceStateTransferService extends StateTransferService<Balance> {}

@Service()
export class OwnerEquityAccountInitialValueStateTransferService extends StateTransferService<OwnerEquityAccountInitialValue> {}

@Service()
export class EntryStateTransferService extends StateTransferService<Entry> {}
