import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { InputField } from "../field/input-field.component";

@Component({
  selector: 'owner-edit',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <a-input-field label="Name"
          [autoFocus]=true
          [control]="form.get('inputName')!" />

        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the owner"/>
        <p-button icon="pi pi-times" (onClick)="cancelUpdate()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class OwnerUpdateComponent extends BeanUpdateComponent<Owner, Owner, Owner> {

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    ownerService: OwnerService
  ) {
    super(router, messageService, formBuilder, ownerService, createForm, createBean)
  }

}

function createForm(formBuilder: FormBuilder, bean: Owner): FormGroup {
  return formBuilder.group({
    inputName: [bean.name, [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup): Owner {
  return new Owner(form.value.inputName)
}
