import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { InputFieldComponent } from '../field/input-field.component';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { OwnerInsertService } from './owner-insert-service';

@Component({
  selector: 'app-owner-insert',
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent, BeanInsertPanelComponent],
  template: `
    <app-bean-insert-panel
      [formGroup]="formGroup"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="'Owner'"
      [routerName]="'owners'"
    >
      <app-input-field label="Name" [autoFocus]="true" [control]="formGroup.get('inputName')!" />
    </app-bean-insert-panel>
  `,
})
export class OwnerInsertComponent {
  formGroup: FormGroup;
  beanInsertService = inject(OwnerInsertService);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      inputName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  createBean(): Owner {
    return new Owner(this.formGroup.value.inputName);
  }
}
