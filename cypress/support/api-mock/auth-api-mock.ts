/// <reference types="cypress" />

import { StatusCodes } from 'http-status-codes';
import { API_PATHS } from '../../../src/app/app.api-paths';

export class AuthApiMock {
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

  public mock() {
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
}
