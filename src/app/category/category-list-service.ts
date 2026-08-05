import { WritableSignal } from '@angular/core';
import { Category, CategoryType } from './category';
import { ModelListService, loadModels } from '../models/model-list-service';
import { AppMessageService } from '../app-message-service';

export class CategoryListService implements ModelListService<Category> {
  constructor(
    private readonly appMessageService: AppMessageService,
    private readonly type: CategoryType,
  ) {}

  findAll(): WritableSignal<Category[]> {
    return loadModels(
      this.appMessageService,
      `${this.type} Category`,
      `${this.type.toLowerCase()}Categories`,
    );
  }
}
