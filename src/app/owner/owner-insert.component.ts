import { Component, inject } from '@angular/core';
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
export class OwnerInsertComponent implements BeanInsertComponent<Owner> {
  form: FormGroup;

  constructor() {
    this.form = inject(OwnerInsertFormGroupService).form;
  }

  createBean(form: FormGroup): Owner {
    return new Owner(form.value.inputName);
  }
}
