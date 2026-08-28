/// <reference types="cypress" />

import { CategoryType } from '../../../src/app/category/category';
import { AccountType } from '../../../src/app/account/account';
import { EntryType } from '../../../src/app/entry/entry';
import { AuthApiMock } from './auth-api-mock';
import { ownerApiMock } from './owner-api-mock';
import { categoryApiMock } from './category-api-mock';
import { accountApiMock } from './account-api-mock';
import { entryApiMock } from './entry-api-mock';
import { balanceApiMock } from './balance-api-mock';
import { ownerEquityAccountInitialValueApiMock } from './owner-equity-account-initial-value-api-mock';

export class AppApiMock {
  private readonly authApiMock;

  public constructor(scenario: 'success' | 'invalid' = 'success') {
    this.authApiMock = new AuthApiMock(scenario);
  }

  mock() {
    this.authApiMock.mock();
    ownerApiMock().mock();
    categoryApiMock(CategoryType.CREDIT).mock();
    categoryApiMock(CategoryType.DEBIT).mock();
    categoryApiMock(CategoryType.EQUITY).mock();
    accountApiMock(AccountType.CREDIT).mock();
    accountApiMock(AccountType.DEBIT).mock();
    accountApiMock(AccountType.EQUITY).mock();
    entryApiMock(EntryType.CREDIT).mock();
    entryApiMock(EntryType.DEBIT).mock();
    entryApiMock(EntryType.TRANSFER).mock();
    balanceApiMock().mock();
    ownerEquityAccountInitialValueApiMock().mock();
  }
}
