import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Account } from './account';
import { AccountService } from './account-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { CategoryService } from '../category/category-service';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'account-insert',
  imports: [AsyncPipe, SelectModule, ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
        <div style="margin-bottom: 10px">
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
        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the account"/>
        <p-button icon="pi pi-times" (onClick)="cancelInsert()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class AccountInsertComponent extends BeanInsertComponent<Account, Account, string> {

  categories$: Observable<Array<Category>>

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, formBuilder, new AccountService(http, route.snapshot.data['type']), createForm, createBean)

    this.categories$ = new CategoryService(http, route.snapshot.data['type']).findAll()
  }

}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    inputDescription: ['', [Validators.required, Validators.minLength(3)]],
    selectCategory: ['', [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup): Account {
  return new Account(form.value.inputDescription, form.value.selectCategory.description)
}
