import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { Category, categoryId } from './category';
import { InputFieldComponent } from '../field/input-field.component';
import { MAX_LENGTH } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryUpdateService } from './category-update-service';
import { ModelUpdatePanelComponent } from '../models/model-update-panel.component';
import { form, maxLength, minLength, required } from '@angular/forms/signals';
import { PATHS } from '../app.paths';
import { CategoryStateTransferService } from '../models/models-state-transfer-service';

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
      [model]="model"
      [createModel]="createModel.bind(this)"
      [modelUpdateService]="modelUpdateService"
      [modelName]="modelName"
      [routerName]="routerName"
      [modelIdFn]="modelIdFn"
      [stateTransferService]="stateTransferService"
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
  stateTransferService = inject(CategoryStateTransferService);
  model = this.stateTransferService.getState();
  form = form(signal(this.model), (f) => {
    required(f.description);
    minLength(f.description, 3);
    maxLength(f.description, MAX_LENGTH);
  });

  private readonly type = inject(ActivatedRoute).snapshot.data['type'];
  routerName = `${this.type.toLowerCase()}${PATHS.CATEGORY_PATH}`;
  modelName = `${this.type} Category`;
  modelUpdateService = new CategoryUpdateService(inject(HttpClient), this.type);

  modelIdFn = categoryId;

  createModel(): Category {
    return { description: this.form().value().description };
  }
}
