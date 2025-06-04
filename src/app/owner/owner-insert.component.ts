import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { InputFieldComponent } from '../field/input-field.component';
import { OwnerInsertFormGroupService } from './owner-insert-form-group.service';

@Component({
  selector: 'app-owner-insert',
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent],
  template: `
    <app-input-field label="Name" [autoFocus]="true" [control]="form.get('inputName')!" />
  `,
})
export class OwnerInsertComponent extends BeanInsertComponent<Owner> {
  form: FormGroup;

  constructor(ownerFormGroupService: OwnerInsertFormGroupService) {
    super(createBean);
    this.form = ownerFormGroupService.form;
  }
}

function createBean(form: FormGroup): Owner {
  return new Owner(form.value.inputName);
}
