import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { CreditAccount } from './creditAccount';
import { CreditAccountService } from './creditAccount-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { CategoryService } from '../category/category-service';
import { Category } from '../category/category';
import { Observable } from 'rxjs';

@Component({
  selector: 'creditAccount-edit',
  imports: [AsyncPipe, SelectModule, ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <div style="margin-bottom: 10px">
          <label for="description">Description:</label>
          <input id="description" 
            name="inputDescription"
            pInputText 
            [pAutoFocus]="true" 
            placeholder="Description to be edited" 
            formControlName="inputDescription" />
          <div
            *ngIf="form.get('inputDescription')?.invalid && (form.get('inputDescription')?.dirty || form.get('inputDescription')?.touched)"
            class="alert"
          >
            <div *ngIf="form.get('inputDescription')?.errors?.['required']">Description is required.</div>
            <div *ngIf="form.get('inputDescription')?.errors?.['minlength']">Description must be at least 3 characters long.</div>
          </div>
        </div>

        <div>
          <label for="category">Category:</label>
          <p-select id="category" 
            name="selectCategory"
            [options]="(categories$ | async)!"
            optionLabel="description"
            placeholder="Select one category" 
            formControlName="selectCategory" />
        </div>

        <p-divider />
        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the credit account"/>
        <p-button icon="pi pi-times" (onClick)="cancelUpdate()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class CreditAccountUpdateComponent extends BeanUpdateComponent<CreditAccount, string> {

  categories$: Observable<Array<Category>>

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    creditAccountService: CreditAccountService,
    categoryService: CategoryService
  ) {
    super(router, messageService, formBuilder, creditAccountService, createForm, createBean)

    this.categories$ = categoryService.findAll()
  }

}

function createForm(formBuilder: FormBuilder, bean: CreditAccount): FormGroup {
  return formBuilder.group({
    inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]],
    selectCategory: [new Category(bean.category), [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup) : CreditAccount {
  return new CreditAccount(form.value.inputDescription, form.value.selectCategory.description)
}
