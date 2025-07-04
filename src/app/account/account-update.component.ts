import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Account } from './account';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { AccountUpdateFormGroupService } from './account-update-form-group.service';
import { CategoryListService } from '../category/category-list-service';

@Component({
  selector: 'app-account-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    CommonModule,
    InputFieldComponent,
    SelectFieldComponent,
  ],
  template: `
    <app-input-field
      label="Description"
      [autoFocus]="true"
      [control]="form.get('inputDescription')!"
    />

    <app-select-field
      label="Category"
      placeholder="Select one category"
      optionLabel="description"
      [options]="(categories$ | async)!"
      [control]="form.get('selectCategory')!"
    />
  `,
})
export class AccountUpdateComponent extends BeanUpdateComponent<Account> {
  form: FormGroup;

  categories$: Observable<Category[]>;

  constructor() {
    super(createBean);

    this.form = inject(AccountUpdateFormGroupService).form;

    this.categories$ = new CategoryListService(
      inject(HttpClient),
      inject(ActivatedRoute).snapshot.data['categoryType'],
    ).findAll();
  }
}

function createBean(form: FormGroup): Account {
  return new Account(form.value.inputDescription, form.value.selectCategory.description);
}
