import { WritableSignal } from '@angular/core';
import { Category, createCategory } from './category';
import { BeanListService, loadBeans } from '../bean/bean-list-service';
import { AppMessageService } from '../app-message-service';

export class CategoryListService implements BeanListService<Category> {
  constructor(
    private readonly appMessageService: AppMessageService,
    private readonly type: string,
  ) {}

  findAll(): WritableSignal<Category[]> {
    return loadBeans(
      this.appMessageService,
      `${this.type} Category`,
      `${this.type.toLowerCase()}Categories`,
      createCategory,
    );
  }
}
