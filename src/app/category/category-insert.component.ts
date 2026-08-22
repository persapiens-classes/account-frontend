import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, categoryId, createCategory } from './category';
import { InputFieldComponent } from '../field/input-field.component';
import { CategoryInsertService } from './category-insert-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModelInsertPanelComponent } from '../models/model-insert-panel.component';
import { form, minLength, required } from '@angular/forms/signals';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-category-insert',
  imports: [CommonModule, InputFieldComponent, ModelInsertPanelComponent],
  template: `
    <app-model-insert-panel
      [form]="form"
      [createModel]="createModel.bind(this)"
      [modelInsertService]="modelInsertService"
      [modelName]="modelName"
      [routerName]="routerName"
      [modelIdFn]="modelIdFn"
    >
      <app-input-field
        label="Description"
        [autoFocus]="true"
        [formField]="form.description"
        dataCy="input-description"
      />
    </app-model-insert-panel>
  `,
})
export class CategoryInsertComponent {
  form = form(signal(createCategory()), (f) => {
    required(f.description);
    minLength(f.description, 3);
  });
  routerName: string;
  modelName: string;
  modelInsertService: CategoryInsertService;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const http = inject(HttpClient);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}${PATHS.CATEGORY_PATH}`;
    this.modelName = `${type} Category`;
    this.modelInsertService = new CategoryInsertService(http, type);
  }
  modelIdFn = categoryId;

  createModel(): Category {
    return { description: this.form().value().description };
  }
}
