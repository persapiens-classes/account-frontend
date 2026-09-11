import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { Owner, ownerId } from './owner';
import { InputFieldComponent } from '../field/input-field.component';
import { ModelUpdatePanelComponent } from '../models/model-update-panel.component';
import { OwnerUpdateService } from './owner-update-service';
import { MAX_LENGTH } from '../models/models';
import { form, minLength, required, maxLength } from '@angular/forms/signals';
import { PATHS } from '../app.paths';
import { OwnerStateTransferService } from '../models/models-state-transfer-service';

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
      [model]="model"
      [createModel]="createModel.bind(this)"
      [modelUpdateService]="modelUpdateService"
      [modelName]="'Owner'"
      [routerName]="routerName"
      [modelIdFn]="modelIdFn"
      [stateTransferService]="stateTransferService"
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
  routerName = PATHS.OWNER_PATH;

  stateTransferService = inject(OwnerStateTransferService);
  model = this.stateTransferService.getState();

  form = form(signal(this.model), (f) => {
    required(f.name);
    minLength(f.name, 3);
    maxLength(f.name, MAX_LENGTH);
  });

  modelUpdateService = inject(OwnerUpdateService);

  modelIdFn = ownerId;

  createModel(): Owner {
    return { name: this.form().value().name };
  }
}
