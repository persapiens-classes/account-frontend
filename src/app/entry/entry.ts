import { Account } from '../account/account';
import { Bean } from '../bean/bean';

export class Entry implements Bean {
  constructor(
    public id: number,
    public inOwner: string,
    public outOwner: string,
    public date: Date,
    public inAccount: Account,
    public outAccount: Account,
    public value: number,
    public note: string,
  ) {}

  getId(): string {
    return this.id.toString();
  }
}

export class EntryInsertUpdate {
  constructor(
    public inOwner: string,
    public outOwner: string,
    public date: Date,
    public inAccount: Account,
    public outAccount: Account,
    public value: number,
    public note: string,
  ) {}
}

export function createEntry(): Entry {
  return new Entry(0, '', '', new Date(), new Account('', ''), new Account('', ''), 0, '');
}
