/// <reference types="cypress" />

import { StatusCodes } from 'http-status-codes';

export function validateNumber(name: string, value: number | undefined): string | null {
  if (!value || value > 0) {
    return `${name} should be a positive number greater than zero`;
  }

  return null;
}

export function validate(name: string, value: string | undefined): string | null {
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

export interface ModelCrudApiMockConfig<I, U, F, ID> {
  endpoint: string;
  idFn: (model: F) => ID;
  models?: F[];
  postValidateFn?: (insertModel: I) => string | null;
  putValidateFn?: (updateModel: U) => string | null;
  insertToModelFn?: (insertModel: I) => F;
  updateToModelFn?: (updateModel: U, id?: string) => F;
  equalsFn?: (model1: F, model2: F) => boolean;
  customMocks?: (() => void)[];
}

export class ModelCrudApiMock<I, U, F, ID> {
  private readonly endpoint: string;
  private readonly idFn: (model: F) => ID;
  private readonly models: F[];
  private readonly postValidateFn: (insertModel: I) => string | null;
  private readonly putValidateFn: (updateModel: U) => string | null;
  private readonly insertToModelFn: (insertModel: I) => F;
  private readonly updateToModelFn: (updateModel: U, id?: string) => F;
  private readonly equalsFn: (model1: F, model2: F) => boolean;
  private readonly customMocks: (() => void)[];
  constructor(config: ModelCrudApiMockConfig<I, U, F, ID>) {
    this.endpoint = config.endpoint;
    this.idFn = config.idFn;
    this.models = config.models || [];
    this.postValidateFn = config.postValidateFn || (() => null);
    this.putValidateFn = config.putValidateFn || (() => null);
    this.insertToModelFn = config.insertToModelFn || ((model: I) => model as unknown as F);
    this.updateToModelFn = config.updateToModelFn || ((model: U) => model as unknown as F);
    this.equalsFn =
      config.equalsFn || ((model1: F, model2: F) => this.idFn(model1) === this.idFn(model2));
    this.customMocks = config.customMocks || [];
  }

  // Mock GET /endpoint - list all models
  private mockGetAll() {
    cy.intercept('GET', `${this.endpoint}`, (req) => {
      if (Object.keys(req.query).length > 0) {
        req.continue();
        return;
      }
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
      const modelPost: I = req.body;

      const validationError = this.postValidateFn(modelPost);
      if (validationError) {
        return req.reply({
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: StatusCodes.BAD_REQUEST,
            message: validationError,
          },
        });
      }

      const modelToInsert = this.insertToModelFn(modelPost);
      // OW-05: Duplicate model
      if (this.models.some((o: F) => this.idFn(o) === this.idFn(modelToInsert))) {
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
      this.models.push(modelToInsert);
      req.reply({
        statusCode: StatusCodes.CREATED,
        body: modelToInsert,
      });
    }).as(`${this.endpoint}-post`);
  }

  // Mock PUT /endpoint/:id - update model
  private mockPut() {
    cy.intercept('PUT', `${this.endpoint}/*`, (req) => {
      const modelPut: U = req.body;

      const validationError = this.putValidateFn(modelPut);
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
        const modelToUpdate = this.updateToModelFn(modelPut, modelId);
        if (this.models.some((model: F) => this.equalsFn(model, modelToUpdate))) {
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
            body: modelToUpdate,
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

    this.customMocks.forEach((customMock) => customMock());
  }
}
