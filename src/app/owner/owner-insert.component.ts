import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputField } from "../field/input-field.component";

@Component({
  selector: 'owner-insert',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
        <a-input-field label="Name" 
          [autoFocus]=true
          [control]="form.get('inputName')!" />

        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the owner"/>
        <p-button icon="pi pi-times" (onClick)="cancelInsert()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class OwnerInsertComponent extends BeanInsertComponent<Owner, Owner, Owner> {

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    ownerService: OwnerService
  ) {
    super(router, messageService, formBuilder, ownerService, createForm, createBean)
  }
}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    inputName: ['', [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup): Owner {
  return new Owner(form.value.inputName)
}

