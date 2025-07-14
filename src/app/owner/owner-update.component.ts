import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { createOwner, Owner } from './owner';
import { InputFieldComponent } from '../field/input-field.component';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { OwnerUpdateService } from './owner-update-service';
import { toBeanFromHistory } from '../bean/bean';

@Component({
  selector: 'app-owner-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    CommonModule,
    InputFieldComponent,
    BeanUpdatePanelComponent,
  ],
  template: `
    <app-bean-update-panel
      [formGroup]="formGroup"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
      [beanName]="'Owner'"
      [routerName]="'owners'"
    >
      <app-input-field label="Name" [autoFocus]="true" [control]="formGroup.get('inputName')!" />
    </app-bean-update-panel>
  `,
})
export class OwnerUpdateComponent {
  formGroup: FormGroup;
  beanFromHistory: Owner;
  beanUpdateService = inject(OwnerUpdateService);

  constructor() {
    this.beanFromHistory = toBeanFromHistory(createOwner);
    this.formGroup = inject(FormBuilder).group({
      inputName: [this.beanFromHistory.name, [Validators.required, Validators.minLength(3)]],
    });
  }

  createBean(): Owner {
    return new Owner(this.formGroup.value.inputName);
  }
}
