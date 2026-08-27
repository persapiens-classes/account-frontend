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
import { Entry, EntryType } from '../../src/app/entry/entry';
import { entryApiPath } from '../e2e/entry/entry-helpers';

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

  private ownerApiMock(): ModelCrudApiMock<Owner, string> {
    const ownersEndpoint = `/${API_PATHS.OWNER_API_PATH}`;

    const idFn = (model: Owner): string => model.name;

    const validateFn = (owner: Owner | undefined): string | null => {
      const ownerName = owner?.name;

      // OW-01: Only whitespace (check first)
      if (!ownerName || ownerName.trim() === '') {
        return 'Owner name cannot contain only whitespace';
      }

      // OW-04: Exceeds max length (256+ characters)
      if (ownerName.length > 255) {
        return 'Owner name must not exceed 255 characters';
      }

      return null;
    };

    const owners = [{ name: 'Owner 1' }, { name: 'Owner 2' }, { name: 'Owner 3' }];

    return new ModelCrudApiMock<Owner, string>(ownersEndpoint, idFn, owners, validateFn);
  }

  private categoryApiMock(type: CategoryType): ModelCrudApiMock<Category, string> {
    const categoriesEndpoint = `/${categoryApiPath(type)}`;

    const idFn = (model: Category): string => model.description;

    const validateFn = (category: Category | undefined): string | null => {
      const categoryDescription = category?.description;

      // OW-01: Only whitespace (check first)
      if (!categoryDescription || categoryDescription.trim() === '') {
        return 'Category description cannot contain only whitespace';
      }

      // OW-04: Exceeds max length (256+ characters)
      if (categoryDescription.length > 255) {
        return 'Category description must not exceed 255 characters';
      }

      return null;
    };

    const categories = [
      { description: `${type} Category 1` },
      { description: `${type} Category 2` },
      { description: `${type} Category 3` },
    ];

    return new ModelCrudApiMock<Category, string>(categoriesEndpoint, idFn, categories, validateFn);
  }

  private accountApiMock(type: AccountType): ModelCrudApiMock<Account, string> {
    const accountsEndpoint = `/${accountApiPath(type)}`;

    const idFn = (model: Account): string => model.description;

    const validateFn = (account: Account | undefined): string | null => {
      const accountDescription = account?.description;

      // OW-01: Only whitespace (check first)
      if (!accountDescription || accountDescription.trim() === '') {
        return 'Account description cannot contain only whitespace';
      }

      // OW-04: Exceeds max length (256+ characters)
      if (accountDescription.length > 255) {
        return 'Account description must not exceed 255 characters';
      }

      return null;
    };

    const accounts = [
      { description: `${type} Account 1`, category: `${type} Category 1` },
      { description: `${type} Account 2`, category: `${type} Category 2` },
      { description: `${type} Account 3`, category: `${type} Category 3` },
    ];

    return new ModelCrudApiMock<Account, string>(accountsEndpoint, idFn, accounts, validateFn);
  }

  private entryApiMock(type: EntryType): ModelCrudApiMock<Entry, string> {
    const accountsEndpoint = `/${entryApiPath(type)}`;

    const idFn = (model: Entry): string => model.id.toString();

    const validateFn = (entry: Entry | undefined): string | null => {
      const accountDescription = entry?.inAccount?.description;

      // OW-01: Only whitespace (check first)
      if (!accountDescription || accountDescription.trim() === '') {
        return 'Account description cannot contain only whitespace';
      }

      // OW-04: Exceeds max length (256+ characters)
      if (accountDescription.length > 255) {
        return 'Account description must not exceed 255 characters';
      }

      return null;
    };

    const entries = [
      {
        id: 1,
        date: new Date(),
        inAccount: { description: `In ${type} Account 1`, category: `${type} Category 1` },
        inOwner: 'In Owner 1',
        outAccount: { description: `Out ${type} Account 1`, category: `${type} Category 1` },
        outOwner: 'Out Owner 1',
        value: 100,
        note: `${type} Entry 1`,
      },
      {
        id: 2,
        date: new Date(),
        inAccount: { description: `In ${type} Account 2`, category: `${type} Category 2` },
        inOwner: 'In Owner 2',
        outAccount: { description: `Out ${type} Account 2`, category: `${type} Category 2` },
        outOwner: 'Out Owner 2',
        value: 200,
        note: `${type} Entry 2`,
      },
    ];

    return new ModelCrudApiMock<Entry, string>(accountsEndpoint, idFn, entries, validateFn);
  }

  private balanceApiMock(): ModelCrudApiMock<Balance, string> {
    const balancesEndpoint = `/${API_PATHS.BALANCE_API_PATH}`;

    const idFn = (model: Balance): string => `${model.owner}-${model.equityAccount.description}`;

    const balances = [
      {
        owner: 'Owner 1',
        equityAccount: {
          description: 'Equity Account 1',
          category: 'Category 1',
        },
        initialValue: 500.0,
        balance: 1000.0,
      },
      {
        owner: 'Owner 2',
        equityAccount: {
          description: 'Equity Account 2',
          category: 'Category 2',
        },
        initialValue: 1000.0,
        balance: 2000.0,
      },
    ];

    return new ModelCrudApiMock<Balance, string>(balancesEndpoint, idFn, balances);
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
