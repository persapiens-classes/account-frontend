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
import { Category } from './category';
import { CategoryService } from './category-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';

@Component({
  selector: 'category-insert',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
        <label for="description">Description:</label>
        <input id="description" 
          name="inputDescription"
          pInputText 
          [pAutoFocus]="true" 
          placeholder="Description to be inserted" 
          formControlName="inputDescription" />
        <div
          *ngIf="form.get('inputDescription')?.invalid && (form.get('inputDescription')?.dirty || form.get('inputDescription')?.touched)"
          class="alert"
        >
          <div *ngIf="form.get('inputDescription')?.errors?.['required']">Description is required.</div>
          <div *ngIf="form.get('inputDescription')?.errors?.['minlength']">Description must be at least 3 characters long.</div>
        </div>
        <p-divider />
        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the category"/>
        <p-button icon="pi pi-times" (onClick)="cancelInsert()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class CategoryInsertComponent extends BeanInsertComponent<Category, string> {

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    categoryService: CategoryService
  ) {
    super(router, messageService, formBuilder, categoryService, createForm, createBean)
  }
  
}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    inputDescription: ['', [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup) : Category {
  return new Category(form.value.inputDescription)
}
