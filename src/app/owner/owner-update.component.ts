import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';

@Component({
  selector: 'owner-edit',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <label for="name">Name:</label>
        <input id="name" 
          name="inputName"
          pInputText 
          [pAutoFocus]="true" 
          placeholder="Name to be edited" 
          formControlName="inputName" />
        <div
          *ngIf="form.get('inputName')?.invalid && (form.get('inputName')?.dirty || form.get('inputName')?.touched)"
          class="alert"
        >
          <div *ngIf="form.get('inputName')?.errors?.['required']">Name is required.</div>
          <div *ngIf="form.get('inputName')?.errors?.['minlength']">Name must be at least 3 characters long.</div>
        </div>
        <p-divider />
        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the owner"/>
        <p-button icon="pi pi-times" (onClick)="cancelUpdate()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class OwnerUpdateComponent extends BeanUpdateComponent<Owner, string> {

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

function createBean(form: FormGroup) : Owner {
  return new Owner(form.value.inputName)
}
