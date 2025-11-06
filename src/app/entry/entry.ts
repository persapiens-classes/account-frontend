import { Account } from '../account/account';
import { Bean } from '../bean/bean';
import { Owner } from '../owner/owner';

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

export function jsonToEntry(result: Entry): Entry {
  result.date = new Date(result.date);
  return result;
}

export enum EntryType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
  TRANSFER = 'Transfer',
}

export interface EntryForm {
  id: number;
  inOwner: Owner;
  outOwner: Owner;
  date: Date;
  inAccount: Account;
  outAccount: Account;
  value: number;
  note: string;
}

export function entryFormToModel(entryForm: EntryForm): EntryInsertUpdate {
  return new EntryInsertUpdate(
    entryForm.inOwner ? entryForm.inOwner.name : '',
    entryForm.outOwner ? entryForm.outOwner.name : '',
    entryForm.date,
    entryForm.inAccount,
    entryForm.outAccount,
    entryForm.value,
    entryForm.note,
  );
}

export function entryModelToForm(entry: Entry): EntryForm {
  return {
    id: entry.id,
    inOwner: new Owner(entry.inOwner),
    outOwner: new Owner(entry.outOwner),
    date: entry.date,
    inAccount: entry.inAccount,
    outAccount: entry.outAccount,
    value: entry.value,
    note: entry.note,
  };
}
