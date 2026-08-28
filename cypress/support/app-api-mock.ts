/// <reference types="cypress" />

import { StatusCodes } from 'http-status-codes';
import { Owner } from '../../src/app/owner/owner';
import { Balance } from '../../src/app/owner-equity-account-initial-value/balance';
import { ModelCrudApiMock } from './model-crud-api-mock';
import { Category, CategoryType } from '../../src/app/category/category';
import { API_PATHS } from '../../src/app/app.api-paths';
import { categoryApiPath } from '../e2e/category/category-helpers';
import { Account, AccountType } from '../../src/app/account/account';
import { accountApiPath } from '../e2e/account/account-helpers';
import { Entry, EntryInsertUpdate, EntryType } from '../../src/app/entry/entry';
import { entryApiPath } from '../e2e/entry/entry-helpers';
import {
  accountsDefault,
  categoriesDefault,
  entriesDefault,
  ownersDefault,
  balancesDefault,
} from './fakers/models-default';

export class AppApiMock {
  private isAuthenticated = false;
  private readonly scenario: 'success' | 'invalid';

  public constructor(scenario: 'success' | 'invalid' = 'success') {
    this.scenario = scenario;
  }

  private interceptPostLogout(logoutEndpoint: string) {
    cy.intercept('POST', logoutEndpoint, (req) => {
      this.isAuthenticated = false;
      req.reply({
        statusCode: StatusCodes.OK,
        body: {},
      });
    }).as('logoutRequest');
  }

  private authMock() {
    const loginEndpoint = `/${API_PATHS.AUTH_LOGIN_PATH}`;
    const logoutEndpoint = `/${API_PATHS.AUTH_LOGOUT_PATH}`;

    const responseInvalid = {
      message: 'Invalid credentials',
      statusCode: 401,
    };

    if (this.scenario === 'success') {
      const responseSuccess = {
        login: 'persapiens',
        token: 'mock-jwt-token',
        expiresIn: 3600,
      };

      cy.intercept('POST', loginEndpoint, (req) => {
        this.isAuthenticated = true;
        req.reply({
          statusCode: StatusCodes.OK,
          body: responseSuccess,
        });
      }).as('loginRequest');

      this.interceptPostLogout(logoutEndpoint);
    } else {
      cy.intercept('POST', loginEndpoint, {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: responseInvalid,
      }).as('loginRequest');

      this.interceptPostLogout(logoutEndpoint);
    }
  }

  private validate(name: string, value: string | undefined): string | null {
    // OW-01: Only whitespace (check first)
    if (!value || value.trim() === '') {
      return `${name} cannot contain only whitespace`;
    }

    // OW-04: Exceeds max length (256+ characters)
    if (value.length > 255) {
      return `${name} must not exceed 255 characters`;
    }

    return null;
  }

  private ownerApiMock(): ModelCrudApiMock<Owner, Owner, Owner, string> {
    const ownersEndpoint = `/${API_PATHS.OWNER_API_PATH}`;

    const idFn = (model: Owner): string => model.name;

    const validateFn = (owner: Owner | undefined): string | null => {
      return this.validate('Owner name', owner?.name);
    };

    const owners = ownersDefault();

    return new ModelCrudApiMock<Owner, Owner, Owner, string>(
      ownersEndpoint,
      idFn,
      owners,
      validateFn,
      validateFn,
    );
  }

  private categoryApiMock(
    type: CategoryType,
  ): ModelCrudApiMock<Category, Category, Category, string> {
    const categoriesEndpoint = `/${categoryApiPath(type)}`;

    const idFn = (model: Category): string => model.description;

    const validateFn = (category: Category | undefined): string | null => {
      return this.validate('Category description', category?.description);
    };

    const categories = categoriesDefault(type);

    return new ModelCrudApiMock<Category, Category, Category, string>(
      categoriesEndpoint,
      idFn,
      categories,
      validateFn,
      validateFn,
    );
  }

  private accountApiMock(type: AccountType): ModelCrudApiMock<Account, Account, Account, string> {
    const accountsEndpoint = `/${accountApiPath(type)}`;

    const idFn = (model: Account): string => model.description;

    const validateFn = (account: Account | undefined): string | null => {
      let result = this.validate('Account description', account?.description);

      if (!result) {
        result = this.validate('Account category', account?.category);
      }
      return result;
    };

    const accounts = accountsDefault(type);

    return new ModelCrudApiMock<Account, Account, Account, string>(
      accountsEndpoint,
      idFn,
      accounts,
      validateFn,
      validateFn,
    );
  }

  private entryApiMock(
    type: EntryType,
  ): ModelCrudApiMock<EntryInsertUpdate, EntryInsertUpdate, Entry, string> {
    const entriesEndpoint = `/${entryApiPath(type)}`;

    const idFn = (model: Entry): string => model.id.toString();

    const validateFn = (entry: EntryInsertUpdate | undefined): string | null => {
      let result = this.validate('In Account description', entry?.inAccount);

      if (!result) {
        result = this.validate('Out Account description', entry?.outAccount);
      }
      if (!result) {
        result = this.validate('In Owner', entry?.inOwner);
      }
      if (!result) {
        result = this.validate('Out Owner', entry?.outOwner);
      }

      return result;
    };

    const entries = entriesDefault(type);
    const creditAccounts = accountsDefault(AccountType.CREDIT);
    const debitAccounts = accountsDefault(AccountType.DEBIT);
    const equityAccounts = accountsDefault(AccountType.EQUITY);

    const insertToModelFn = (insertModel: EntryInsertUpdate): Entry => {
      const inAccount =
        debitAccounts.find((a) => a.description === insertModel.inAccount) ||
        equityAccounts.find((a) => a.description === insertModel.inAccount);

      const outAccount =
        creditAccounts.find((a) => a.description === insertModel.outAccount) ||
        equityAccounts.find((a) => a.description === insertModel.outAccount);

      return {
        id: entries.length + 1, // Assign a new ID based on the current length of entries
        date: insertModel.date,
        value: insertModel.value,
        note: insertModel.note,
        inAccount: inAccount!,
        outAccount: outAccount!,
        inOwner: insertModel.inOwner,
        outOwner: insertModel.outOwner,
      };
    };

    const updateToModelFn = (updateModel: EntryInsertUpdate, id?: string): Entry => {
      const inAccount =
        debitAccounts.find((a) => a.description === updateModel.inAccount) ||
        equityAccounts.find((a) => a.description === updateModel.inAccount);

      const outAccount =
        creditAccounts.find((a) => a.description === updateModel.outAccount) ||
        equityAccounts.find((a) => a.description === updateModel.outAccount);

      return {
        id: id ? Number.parseInt(id) : 0,
        date: updateModel.date,
        value: updateModel.value,
        note: updateModel.note,
        inAccount: inAccount!,
        outAccount: outAccount!,
        inOwner: updateModel.inOwner,
        outOwner: updateModel.outOwner,
      };
    };

    const equalsFn = (model1: Entry, model2: Entry): boolean => {
      return (
        model1.id === model2.id &&
        model1.note === model2.note &&
        model1.value === model2.value &&
        model1.date.getTime() === model2.date.getTime() &&
        model1.inAccount.description === model2.inAccount.description &&
        model1.outAccount.description === model2.outAccount.description &&
        model1.inOwner === model2.inOwner &&
        model1.outOwner === model2.outOwner
      );
    };

    return new ModelCrudApiMock<EntryInsertUpdate, EntryInsertUpdate, Entry, string>(
      entriesEndpoint,
      idFn,
      entries,
      validateFn,
      validateFn,
      insertToModelFn,
      updateToModelFn,
      equalsFn,
    );
  }

  private balanceApiMock(): ModelCrudApiMock<Balance, Balance, Balance, string> {
    const balancesEndpoint = `/${API_PATHS.BALANCE_API_PATH}`;

    const idFn = (model: Balance): string => `${model.owner}-${model.equityAccount.description}`;

    const balances = balancesDefault();

    return new ModelCrudApiMock<Balance, Balance, Balance, string>(
      balancesEndpoint,
      idFn,
      balances,
    );
  }

  mock() {
    this.authMock();
    this.ownerApiMock().mock();
    this.categoryApiMock(CategoryType.CREDIT).mock();
    this.categoryApiMock(CategoryType.DEBIT).mock();
    this.categoryApiMock(CategoryType.EQUITY).mock();
    this.accountApiMock(AccountType.CREDIT).mock();
    this.accountApiMock(AccountType.DEBIT).mock();
    this.accountApiMock(AccountType.EQUITY).mock();
    this.entryApiMock(EntryType.CREDIT).mock();
    this.entryApiMock(EntryType.DEBIT).mock();
    this.entryApiMock(EntryType.TRANSFER).mock();
    this.balanceApiMock().mock();
  }
}
