import { Account, AccountType } from '../../../src/app/account/account';
import { Owner } from '../../../src/app/owner/owner';
import { Category, CategoryType } from '../../../src/app/category/category';
import { Entry, EntryType } from '../../../src/app/entry/entry';
import { Balance } from '../../../src/app/owner-equity-account-initial-value/balance';

export function ownersDefault(): Owner[] {
  return [{ name: 'Owner 1' }, { name: 'Owner 2' }, { name: 'Owner 3' }];
}

export function categoriesDefault(type: CategoryType): Category[] {
  return [
    { description: `${type} Category 1` },
    { description: `${type} Category 2` },
    { description: `${type} Category 3` },
  ];
}

export function accountsDefault(type: AccountType): Account[] {
  let categories: Category[];
  if (type === AccountType.CREDIT) {
    categories = categoriesDefault(CategoryType.CREDIT);
  } else if (type === AccountType.DEBIT) {
    categories = categoriesDefault(CategoryType.DEBIT);
  } else if (type === AccountType.EQUITY) {
    categories = categoriesDefault(CategoryType.EQUITY);
  } else {
    throw new Error(`Invalid account type: ${type}`);
  }
  return [
    { description: `${type} Account 1`, category: categories.at(0)!.description },
    { description: `${type} Account 2`, category: categories.at(1)!.description },
    { description: `${type} Account 3`, category: categories.at(2)!.description },
  ];
}

export function entriesDefault(type: EntryType): Entry[] {
  const owners = ownersDefault();
  let inAccounts: Account[];
  let outAccounts: Account[];
  if (type === EntryType.CREDIT) {
    inAccounts = accountsDefault(AccountType.EQUITY);
    outAccounts = accountsDefault(AccountType.CREDIT);
  } else if (type === EntryType.DEBIT) {
    inAccounts = accountsDefault(AccountType.DEBIT);
    outAccounts = accountsDefault(AccountType.EQUITY);
  } else if (type === EntryType.TRANSFER) {
    inAccounts = accountsDefault(AccountType.EQUITY);
    outAccounts = accountsDefault(AccountType.EQUITY);
  } else {
    throw new Error(`Invalid account type: ${type}`);
  }
  return [
    {
      id: 1,
      date: new Date(),
      inAccount: inAccounts.at(0)!,
      inOwner: owners.at(0)!.name,
      outAccount: outAccounts.at(0)!,
      outOwner: owners.at(1)!.name,
      value: 100,
      note: `${type} Entry 1`,
    },
    {
      id: 2,
      date: new Date(),
      inAccount: inAccounts.at(1)!,
      inOwner: owners.at(0)!.name,
      outAccount: outAccounts.at(1)!,
      outOwner: owners.at(1)!.name,
      value: 200,
      note: `${type} Entry 2`,
    },
  ];
}

export function balancesDefault(): Balance[] {
  const owners = ownersDefault();
  const equityAccounts = accountsDefault(AccountType.EQUITY);
  return [
    {
      owner: owners.at(0)!.name,
      equityAccount: equityAccounts.at(0)!,
      initialValue: 500.0,
      balance: 1000.0,
    },
    {
      owner: owners.at(1)!.name,
      equityAccount: equityAccounts.at(1)!,
      initialValue: 1000.0,
      balance: 2000.0,
    },
  ];
}
