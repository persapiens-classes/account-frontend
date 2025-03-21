import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { InputField } from "../field/input-field.component";
import { OwnerFormGroupService } from './owner-form-group.service';

@Component({
  selector: 'owner-insert',
  imports: [ReactiveFormsModule, CommonModule, InputField],
  template: `
    <a-input-field label="Name" 
      [autoFocus]=true
      [control]="form.get('inputName')!" />
  `
})
export class OwnerInsertComponent extends BeanInsertComponent<Owner, Owner, Owner> {
  form: FormGroup

  constructor(ownerFormGroupService: OwnerFormGroupService,
    ownerService: OwnerService
  ) {
    super(ownerService)
    this.form = ownerFormGroupService.getForm()
  }
  
  createBean(): Owner {
    return new Owner(this.form.value.inputName)
  }
}

