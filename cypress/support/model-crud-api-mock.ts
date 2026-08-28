/// <reference types="cypress" />

import { StatusCodes } from 'http-status-codes';

export class ModelCrudApiMock<I, U, F, ID> {
  private readonly endpoint: string;
  private readonly idFn: (model: F) => ID;
  private readonly models: F[];
  private readonly postValidateFn: (insertModel: I) => string | null;
  private readonly putValidateFn: (updateModel: U) => string | null;
  private readonly insertToModelFn: (insertModel: I) => F;
  private readonly updateToModelFn: (updateModel: U, id?: string) => F;
  private readonly equalsFn: (model1: F, model2: F) => boolean;
  constructor(
    endpoint: string,
    idFn: (model: F) => ID,
    models?: F[],
    postValidateFn?: (insertModel: I) => string | null,
    putValidateFn?: (updateModel: U) => string | null,
    insertToModelFn?: (insertModel: I) => F,
    updateToModelFn?: (updateModel: U, id?: string) => F,
    equalsFn?: (model1: F, model2: F) => boolean,
  ) {
    this.endpoint = endpoint;
    this.idFn = idFn;
    this.models = models || [];
    this.postValidateFn = postValidateFn || (() => null);
    this.putValidateFn = putValidateFn || (() => null);
    this.insertToModelFn = insertToModelFn || ((model: I) => model as unknown as F);
    this.updateToModelFn = updateToModelFn || ((model: U) => model as unknown as F);
    this.equalsFn = equalsFn || ((model1: F, model2: F) => this.idFn(model1) === this.idFn(model2));
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
          console.log(`Updated model for ${this.endpoint} with ID: ${modelId}`);
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
  }
}
