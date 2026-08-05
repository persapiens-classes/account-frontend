import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { Owner, ownerId } from './owner';
import { InputFieldComponent } from '../field/input-field.component';
import { ModelUpdatePanelComponent } from '../models/model-update-panel.component';
import { OwnerUpdateService } from './owner-update-service';
import { toModelFromHistory } from '../models/models';
import { form, minLength, required, maxLength } from '@angular/forms/signals';

@Component({
  selector: 'app-owner-update',
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
      [modelName]="'Owner'"
      [routerName]="'owners'"
      [modelIdFn]="modelIdFn"
    >
      <app-input-field
        label="Name"
        [autoFocus]="true"
        [formField]="form.name"
        dataCy="input-name"
      />
    </app-model-update-panel>
  `,
})
export class OwnerUpdateComponent {
  form = form(signal(toModelFromHistory<Owner>()), (f) => {
    required(f.name);
    minLength(f.name, 3);
    maxLength(f.name, 255);
  });

  modelUpdateService = inject(OwnerUpdateService);

  modelFromHistory = toModelFromHistory<Owner>();

  modelIdFn = ownerId;

  createModel(): Owner {
    return { name: this.form().value().name };
  }
}
