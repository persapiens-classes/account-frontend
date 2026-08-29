import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createOwner, Owner, ownerId } from './owner';
import { InputFieldComponent } from '../field/input-field.component';
import { ModelInsertPanelComponent } from '../models/model-insert-panel.component';
import { OwnerInsertService } from './owner-insert-service';
import { form, minLength, required, maxLength } from '@angular/forms/signals';
import { PATHS } from '../app.paths';
import { MAX_LENGTH } from '../models/models';

@Component({
  selector: 'app-owner-insert',
  imports: [CommonModule, InputFieldComponent, ModelInsertPanelComponent],
  template: `
    <app-model-insert-panel
      [form]="form"
      [createModel]="createModel.bind(this)"
      [modelInsertService]="modelInsertService"
      [modelIdFn]="modelIdFn"
      [modelName]="'Owner'"
      [routerName]="routerName"
    >
      <app-input-field
        label="Name"
        [autoFocus]="true"
        [formField]="form.name"
        dataCy="input-name"
      />
    </app-model-insert-panel>
  `,
})
export class OwnerInsertComponent {
  routerName = PATHS.OWNER_PATH;

  form = form(signal(createOwner()), (f) => {
    required(f.name);
    minLength(f.name, 3);
    maxLength(f.name, MAX_LENGTH);
  });

  modelInsertService = inject(OwnerInsertService);
  modelIdFn = ownerId;

  createModel(): Owner {
    return { name: this.form().value().name };
  }
}
