import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { Account } from './account';
import { AccountService } from './account-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category/category-service';
import { InputField } from "../field/input-field.component";
import { SelectField } from "../field/select-field.component";

@Component({
  selector: 'account-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField, SelectField],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <a-input-field label="Description" 
          [autoFocus]=true
          [control]="form.get('inputDescription')!" />

        <a-select-field label="Category" 
          placeholder="Select one category" 
          optionLabel="description"
          [options]="(categories$ | async)!"
          [control]="form.get('selectCategory')!" />

        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the account"/>
        <p-button icon="pi pi-list" (onClick)="cancelToList()" [style]="{'margin-right': '10px'}" pTooltip="Cancel to list"/>
        <p-button icon="pi pi-search" (onClick)="cancelToDetail()" pTooltip="Cancel to detail"/>
      </p-panel>
    </form>
  `
})
export class AccountUpdateComponent extends BeanUpdateComponent<Account, Account, Account> {

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

function createForm(formBuilder: FormBuilder, bean: Account): FormGroup {
  return formBuilder.group({
    inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]],
    selectCategory: [new Category(bean.category), [Validators.required]]
  })
}

function createBean(form: FormGroup): Account {
  return new Account(form.value.inputDescription, form.value.selectCategory.description)
}
