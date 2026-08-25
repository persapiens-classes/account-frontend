/// <reference types="cypress" />

import { StatusCodes } from 'http-status-codes';
import { Owner } from '../../src/app/owner/owner';
import { Balance } from '../../src/app/owner-equity-account-initial-value/balance';
import { ModelCrudApiMock } from './model-crud-api-mock';
import { Category, CategoryType } from '../../src/app/category/category';

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
    const loginEndpoint = '**/auth/login';
    const meEndpoint = '**/auth/me';
    const logoutEndpoint = '**/auth/logout';

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

      cy.intercept('GET', meEndpoint, (req) => {
        if (!this.isAuthenticated) {
          return req.reply({
            statusCode: StatusCodes.UNAUTHORIZED,
            body: responseInvalid,
          });
        }

        return req.reply({
          statusCode: StatusCodes.OK,
          body: responseSuccess,
        });
      }).as('meRequest');

      this.interceptPostLogout(logoutEndpoint);
    } else {
      cy.intercept('POST', loginEndpoint, {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: responseInvalid,
      }).as('loginRequest');

      cy.intercept('GET', meEndpoint, {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: responseInvalid,
      }).as('meRequest');

      this.interceptPostLogout(logoutEndpoint);
    }
  }

  private ownerApiMock(): ModelCrudApiMock<Owner, string> {
    const ownersEndpoint = '**/owners';

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
    const categoriesEndpoint = `**/${type.toLowerCase()}Categories`;

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

  private balanceApiMock(): ModelCrudApiMock<Balance, string> {
    const balancesEndpoint = '**/balances';

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
    this.balanceApiMock().mock();
  }
}
