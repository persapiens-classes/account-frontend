import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Owner } from './owner';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { InputFieldComponent } from '../field/input-field.component';
import { OwnerUpdateFormGroupService } from './owner-update-form-group.service';

@Component({
  selector: 'app-owner-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputFieldComponent],
  template: `
    <app-input-field label="Name" [autoFocus]="true" [control]="form.get('inputName')!" />
  `,
})
export class OwnerUpdateComponent implements BeanUpdateComponent<Owner> {
  form: FormGroup;

  constructor() {
    this.form = inject(OwnerUpdateFormGroupService).getForm();
  }

  createBean(form: FormGroup): Owner {
    return new Owner(form.value.inputName);
  }
}
