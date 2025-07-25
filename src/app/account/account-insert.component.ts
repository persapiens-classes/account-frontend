import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Account } from './account';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { CategoryListService } from '../category/category-list-service';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { AccountInsertService } from './account-insert-service';

@Component({
  selector: 'app-account-insert',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputFieldComponent,
    SelectFieldComponent,
    BeanInsertPanelComponent,
  ],
  template: `
    <app-bean-insert-panel
      [formGroup]="formGroup"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-input-field label="Description" [autoFocus]="true" formControlName="inputDescription" />

      <app-select-field
        label="Category"
        placeholder="Select one category"
        optionLabel="description"
        [options]="(categories$ | async)!"
        formControlName="selectCategory"
      />
    </app-bean-insert-panel>
  `,
})
export class AccountInsertComponent {
  formGroup: FormGroup;
  routerName: string;
  beanName: string;
  beanInsertService: AccountInsertService;

  categories$: Observable<Category[]>;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      selectCategory: ['', [Validators.required]],
      inputDescription: ['', [Validators.required, Validators.minLength(3)]],
    });

    const activatedRoute = inject(ActivatedRoute);
    const http = inject(HttpClient);

    this.categories$ = new CategoryListService(
      http,
      activatedRoute.snapshot.data['categoryType'],
    ).findAll();

    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Accounts`;
    this.beanName = `${type} Account`;
    this.beanInsertService = new AccountInsertService(http, type);
  }

  createBean(): Account {
    return new Account(
      this.formGroup.value.inputDescription,
      this.formGroup.value.selectCategory.description,
    );
  }
}
