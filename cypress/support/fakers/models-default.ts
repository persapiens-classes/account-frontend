import { Account, AccountType } from '../../../src/app/account/account';
import { Owner } from '../../../src/app/owner/owner';
import { Category, CategoryType } from '../../../src/app/category/category';
import { Entry, EntryType } from '../../../src/app/entry/entry';
import { Balance } from '../../../src/app/owner-equity-account-initial-value/balance';
import {
  accountFactory,
  balanceFactory,
  categoryFactory,
  entryFactory,
  ownerFactory,
} from './models-fake-factory';

let owners: Owner[];
let creditCategories: Category[];
let debitCategories: Category[];
let equityCategories: Category[];
let creditAccounts: Account[];
let debitAccounts: Account[];
let equityAccounts: Account[];
let creditEntries: Entry[];
let debitEntries: Entry[];
let transferEntries: Entry[];
let balances: Balance[];

function checkOwners() {
  if (!owners) {
    owners = ownerFactory.buildList(3);
  }
}

export function ownersDefault(): Owner[] {
  checkOwners();
  return structuredClone(owners);
}

function checkCategories() {
  if (!creditCategories) {
    creditCategories = categoryFactory.withType(CategoryType.CREDIT).buildList(3);
    debitCategories = categoryFactory.withType(CategoryType.DEBIT).buildList(3);
    equityCategories = categoryFactory.withType(CategoryType.EQUITY).buildList(3);
  }
}

export function categoriesDefault(type: CategoryType): Category[] {
  checkCategories();

  let categories: Category[];
  if (type === CategoryType.CREDIT) {
    categories = creditCategories;
  } else if (type === CategoryType.DEBIT) {
    categories = debitCategories;
  } else if (type === CategoryType.EQUITY) {
    categories = equityCategories;
  } else {
    throw new Error(`Invalid category type: ${type}`);
  }
  return structuredClone(categories);
}

function checkAccounts() {
  checkCategories();

  if (!creditAccounts) {
    creditAccounts = [
      accountFactory.withTypeAndCategory(AccountType.CREDIT, creditCategories.at(0)!).build(),
      accountFactory.withTypeAndCategory(AccountType.CREDIT, creditCategories.at(1)!).build(),
      accountFactory.withTypeAndCategory(AccountType.CREDIT, creditCategories.at(2)!).build(),
    ];
    debitAccounts = [
      accountFactory.withTypeAndCategory(AccountType.DEBIT, debitCategories.at(0)!).build(),
      accountFactory.withTypeAndCategory(AccountType.DEBIT, debitCategories.at(1)!).build(),
      accountFactory.withTypeAndCategory(AccountType.DEBIT, debitCategories.at(2)!).build(),
    ];
    equityAccounts = [
      accountFactory.withTypeAndCategory(AccountType.EQUITY, equityCategories.at(0)!).build(),
      accountFactory.withTypeAndCategory(AccountType.EQUITY, equityCategories.at(1)!).build(),
      accountFactory.withTypeAndCategory(AccountType.EQUITY, equityCategories.at(2)!).build(),
    ];
  }
}

export function accountsDefault(type: AccountType): Account[] {
  checkAccounts();

  let accounts: Account[];
  if (type === AccountType.CREDIT) {
    accounts = creditAccounts;
  } else if (type === AccountType.DEBIT) {
    accounts = debitAccounts;
  } else if (type === AccountType.EQUITY) {
    accounts = equityAccounts;
  } else {
    throw new Error(`Invalid account type: ${type}`);
  }
  return structuredClone(accounts);
}

function checkEntries() {
  checkOwners();
  checkAccounts();

  if (!creditEntries) {
    creditEntries = [
      entryFactory.build({
        inAccount: equityAccounts.at(0)!,
        inOwner: owners.at(0)!.name,
        outAccount: creditAccounts.at(0)!,
        outOwner: owners.at(1)!.name,
      }),
      entryFactory.build({
        inAccount: equityAccounts.at(1)!,
        inOwner: owners.at(1)!.name,
        outAccount: creditAccounts.at(1)!,
        outOwner: owners.at(0)!.name,
      }),
    ];
    debitEntries = [
      entryFactory.build({
        inAccount: debitAccounts.at(0)!,
        inOwner: owners.at(0)!.name,
        outAccount: equityAccounts.at(0)!,
        outOwner: owners.at(1)!.name,
      }),
      entryFactory.build({
        inAccount: debitAccounts.at(1)!,
        inOwner: owners.at(0)!.name,
        outAccount: equityAccounts.at(1)!,
        outOwner: owners.at(1)!.name,
      }),
    ];
    transferEntries = [
      entryFactory.build({
        inAccount: equityAccounts.at(0)!,
        inOwner: owners.at(0)!.name,
        outAccount: equityAccounts.at(1)!,
        outOwner: owners.at(1)!.name,
      }),
      entryFactory.build({
        inAccount: equityAccounts.at(1)!,
        inOwner: owners.at(1)!.name,
        outAccount: equityAccounts.at(2)!,
        outOwner: owners.at(0)!.name,
      }),
    ];
  }
}

export function entriesDefault(type: EntryType): Entry[] {
  checkEntries();

  let entries: Entry[];
  if (type === EntryType.CREDIT) {
    entries = creditEntries;
  } else if (type === EntryType.DEBIT) {
    entries = debitEntries;
  } else if (type === EntryType.TRANSFER) {
    entries = transferEntries;
  } else {
    throw new Error(`Invalid entry type: ${type}`);
  }
  return structuredClone(entries);
}

function checkBalances() {
  checkOwners();
  checkAccounts();

  if (!balances) {
    balances = [
      balanceFactory.build({
        owner: owners.at(0)!.name,
        equityAccount: equityAccounts.at(0)!,
      }),
      balanceFactory.build({
        owner: owners.at(1)!.name,
        equityAccount: equityAccounts.at(1)!,
      }),
    ];
  }
}

export function balancesDefault(): Balance[] {
  checkBalances();

  return structuredClone(balances);
}
