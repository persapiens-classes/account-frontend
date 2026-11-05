import { WritableSignal } from '@angular/core';
import { Category, CategorySchema, CategoryType } from './category';
import { ModelListService, findAllModels } from '../models/model-list-service';
import { AppMessageService } from '../app-message-service';
import { API_PATHS } from '../app.api-paths';

export class CategoryListService implements ModelListService<Category> {
  constructor(
    private readonly appMessageService: AppMessageService,
    private readonly type: CategoryType,
  ) {}

  findAll(): WritableSignal<Category[]> {
    return findAllModels(
      this.appMessageService,
      `${this.type} Category`,
      `${this.type.toLowerCase()}${API_PATHS.CATEGORY_API_PATH}`,
      CategorySchema,
    );
  }
}
