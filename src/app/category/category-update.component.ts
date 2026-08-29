import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { Category, categoryId, CategorySchema } from './category';
import { InputFieldComponent } from '../field/input-field.component';
import { MAX_LENGTH, toModelFromHistory } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryUpdateService } from './category-update-service';
import { ModelUpdatePanelComponent } from '../models/model-update-panel.component';
import { form, maxLength, minLength, required } from '@angular/forms/signals';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-category-update',
  imports: [
    ButtonModule,
    PanelModule,
    CommonModule,
    InputFieldComponent,
    ModelUpdatePanelComponent,
  ],
  template: `
    <app-model-update-panel
      [form]="form"
      [modelFromHistory]="modelFromHistory"
      [createModel]="createModel.bind(this)"
      [modelUpdateService]="modelUpdateService"
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
    </app-model-update-panel>
  `,
})
export class CategoryUpdateComponent {
  form = form(signal(toModelFromHistory<Category>(CategorySchema)), (f) => {
    required(f.description);
    minLength(f.description, 3);
    maxLength(f.description, MAX_LENGTH);
  });
  modelFromHistory = toModelFromHistory<Category>(CategorySchema);
  routerName: string;
  modelName: string;
  modelUpdateService: CategoryUpdateService;
  modelIdFn = categoryId;

  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}${PATHS.CATEGORY_PATH}`;
    this.modelName = `${type} Category`;
    this.modelUpdateService = new CategoryUpdateService(inject(HttpClient), type);
  }

  createModel(): Category {
    return { description: this.form().value().description };
  }
}
