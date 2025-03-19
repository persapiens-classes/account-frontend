import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Account } from './account';
import { AccountService } from './account-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category/category-service';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'account-insert',
  imports: [FloatLabelModule, AsyncPipe, SelectModule, ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
        <p-float-label variant="in" class="margin-bottom">
          <input id="description" 
            name="inputDescription"
            pInputText 
            [pAutoFocus]="true" 
            formControlName="inputDescription" />
          <label for="description">Description</label>
        </p-float-label>
        <div *ngIf="form.get('inputDescription')?.invalid && (form.get('inputDescription')?.dirty || form.get('inputDescription')?.touched)"
          class="alert" class="margin-bottom">
          <div *ngIf="form.get('inputDescription')?.errors?.['required']">Description is required.</div>
          <div *ngIf="form.get('inputDescription')?.errors?.['minlength']">Description must be at least 3 characters long.</div>
        </div>

        <p-float-label variant="in" class="margin-bottom">
          <p-select id="category" 
            name="selectCategory"
            [options]="(categories$ | async)!"
            optionLabel="description"
            placeholder="Select one category" 
            formControlName="selectCategory" />
          <label for="category">Category</label>
        </p-float-label>

        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the account"/>
        <p-button icon="pi pi-times" (onClick)="cancelInsert()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class AccountInsertComponent extends BeanInsertComponent<Account, Account, Account> {

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
    selectCategory: ['', [Validators.required]]
  })
}

function createBean(form: FormGroup): Account {
  return new Account(form.value.inputDescription, form.value.selectCategory.description)
}
