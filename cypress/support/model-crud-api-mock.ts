/// <reference types="cypress" />

import { StatusCodes } from 'http-status-codes';

export class ModelCrudApiMock<T, ID> {
  private readonly endpoint: string;
  private readonly idFn: (model: T) => ID;
  private readonly models: T[];
  private readonly validateFn: (model: T) => string | null;
  constructor(
    endpoint: string,
    idFn: (model: T) => ID,
    models?: T[],
    validateFn?: (model: T) => string | null,
  ) {
    this.endpoint = endpoint;
    this.idFn = idFn;
    this.models = models || [];
    this.validateFn = validateFn || (() => null);
  }

  // Mock GET /endpoint - list all models
  private mockGetAll() {
    cy.intercept('GET', `${this.endpoint}`, (req) => {
      req.reply({
        statusCode: StatusCodes.OK,
        body: this.models,
      });
    }).as(`${this.endpoint}-getAll`);
  }

  // Mock DELETE /endpoint/:id - delete model
  private mockDelete() {
    cy.intercept('DELETE', `${this.endpoint}/*`, (req) => {
      // Remove from created models list if it exists
      const urlParts = req.url.split('/');
      const modelId = decodeURIComponent(urlParts.at(-1) ?? '');

      const index = this.models.findIndex((model) => this.idFn(model) === modelId);
      if (index > -1) {
        this.models.splice(index, 1);
        req.reply({
          statusCode: StatusCodes.NO_CONTENT,
          body: {},
        });
      } else {
        req.reply({
          statusCode: StatusCodes.NOT_FOUND,
          body: {},
        });
      }
    }).as(`${this.endpoint}-delete`);
  }

  // Mock POST /endpoint - create a new model with boundary value validation
  private mockPost() {
    cy.intercept('POST', `${this.endpoint}`, (req) => {
      const model = req.body;

      const validationError = this.validateFn(model);
      if (validationError) {
        return req.reply({
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: StatusCodes.BAD_REQUEST,
            message: validationError,
          },
        });
      }

      // OW-05: Duplicate model
      if (this.models.some((o: T) => this.idFn(o) === this.idFn(model))) {
        return req.reply({
          statusCode: StatusCodes.CONFLICT,
          body: {
            error: StatusCodes.CONFLICT,
            message: `${this.endpoint} Model already exists`,
          },
        });
      }

      // OW-03: Valid model
      // Track the created model
      this.models.push(model);
      req.reply({
        statusCode: StatusCodes.CREATED,
        body: model,
      });
    }).as(`${this.endpoint}-post`);
  }

  // Mock PUT /endpoint/:id - update model
  private mockPut() {
    cy.intercept('PUT', `${this.endpoint}/*`, (req) => {
      const modelToUpdate = req.body;

      const validationError = this.validateFn(modelToUpdate);
      if (validationError) {
        return req.reply({
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: StatusCodes.BAD_REQUEST,
            message: validationError,
          },
        });
      }

      const urlParts = req.url.split('/');
      const modelId = decodeURIComponent(urlParts.at(-1) ?? '');

      // Verify that the model exists before updating
      const index = this.models.findIndex((model) => this.idFn(model) === modelId);
      if (index > -1) {
        // OW-05: Duplicate model
        if (this.models.some((model: T) => this.idFn(model) === this.idFn(modelToUpdate))) {
          return req.reply({
            statusCode: StatusCodes.CONFLICT,
            body: {
              error: StatusCodes.CONFLICT,
              message: `${this.endpoint} Model already exists`,
            },
          });
        } else {
          this.models.splice(index, 1, modelToUpdate);
          req.reply({
            statusCode: StatusCodes.OK,
            body: req.body,
          });
        }
      } else {
        req.reply({
          statusCode: StatusCodes.NOT_FOUND,
          body: {},
        });
      }
    }).as(`${this.endpoint}-put`);
  }

  mock() {
    this.mockGetAll();
    this.mockDelete();
    this.mockPost();
    this.mockPut();
  }
}
