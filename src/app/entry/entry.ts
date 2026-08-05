import { Account, createAccount } from '../account/account';
import { Owner } from '../owner/owner';

export interface Entry {
  id: number;
  inOwner: string;
  outOwner: string;
  date: Date;
  inAccount: Account;
  outAccount: Account;
  value: number;
  note: string;
}

export function entryId(entry: Entry): string {
  return entry.id.toString();
}

export interface EntryInsertUpdate {
  inOwner: string;
  outOwner: string;
  date: Date;
  inAccount: string;
  outAccount: string;
  value: number;
  note: string;
}

export function createEntry(): Entry {
  return {
    id: 0,
    inOwner: '',
    outOwner: '',
    date: new Date(),
    inAccount: createAccount(),
    outAccount: createAccount(),
    value: 0,
    note: '',
  };
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
  return {
    inOwner: entryForm.inOwner ? entryForm.inOwner.name : '',
    outOwner: entryForm.outOwner ? entryForm.outOwner.name : '',
    date: entryForm.date,
    inAccount: entryForm.inAccount ? entryForm.inAccount.description : '',
    outAccount: entryForm.outAccount ? entryForm.outAccount.description : '',
    value: entryForm.value,
    note: entryForm.note,
  };
}

export function entryModelToForm(entry: Entry): EntryForm {
  return {
    id: entry.id,
    inOwner: { name: entry.inOwner },
    outOwner: { name: entry.outOwner },
    date: entry.date,
    inAccount: entry.inAccount,
    outAccount: entry.outAccount,
    value: entry.value,
    note: entry.note,
  };
}
