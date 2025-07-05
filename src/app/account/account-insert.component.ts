import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Account } from './account';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { AccountInsertFormGroupService } from './account-insert-form-group.service';
import { CategoryListService } from '../category/category-list-service';

@Component({
  selector: 'app-account-insert',
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent, SelectFieldComponent],
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
export class AccountInsertComponent implements BeanInsertComponent<Account> {
  form: FormGroup;

  categories$: Observable<Category[]>;

  constructor() {
    this.categories$ = new CategoryListService(
      inject(HttpClient),
      inject(ActivatedRoute).snapshot.data['categoryType'],
    ).findAll();

    this.form = inject(AccountInsertFormGroupService).form;
  }

  createBean(form: FormGroup): Account {
    return new Account(form.value.inputDescription, form.value.selectCategory.description);
  }
}
