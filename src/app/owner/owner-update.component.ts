import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { InputField } from "../field/input-field.component";
import { OwnerUpdateFormGroupService } from './owner-update-form-group.service';

@Component({
  selector: 'owner-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField],
  template: `
    <a-input-field label="Name"
      [autoFocus]=true
      [control]="form.get('inputName')!" />
  `
})
export class OwnerUpdateComponent extends BeanUpdateComponent<Owner, Owner, Owner> {
  form: FormGroup

  constructor(ownerFormGroupService: OwnerUpdateFormGroupService,
    ownerService: OwnerService
  ) {
    super(ownerService)
    this.form = ownerFormGroupService.form
  }

  createBean(): Owner {
    return new Owner(this.form.value.inputName)
  }

}
