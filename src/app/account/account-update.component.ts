import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Account, createAccount } from './account';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { CategoryListService } from '../category/category-list-service';
import { AccountUpdateService } from './account-update-service';
import { toBeanFromHistory } from '../bean/bean';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';

@Component({
  selector: 'app-account-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    CommonModule,
    InputFieldComponent,
    SelectFieldComponent,
    BeanUpdatePanelComponent,
  ],
  template: `
    <app-bean-update-panel
      [formGroup]="formGroup"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
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
    </app-bean-update-panel>
  `,
})
export class AccountUpdateComponent {
  formGroup: FormGroup;
  beanFromHistory: Account;
  routerName: string;
  beanName: string;
  beanUpdateService: AccountUpdateService;

  categories$: Observable<Category[]>;

  constructor() {
    this.beanFromHistory = toBeanFromHistory(createAccount);
    this.formGroup = inject(FormBuilder).group({
      inputDescription: [
        this.beanFromHistory.description,
        [Validators.required, Validators.minLength(3)],
      ],
      selectCategory: [new Category(this.beanFromHistory.category), [Validators.required]],
    });

    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.beanName = `${type} Account`;
    this.routerName = `${type.toLowerCase()}Accounts`;
    const http = inject(HttpClient);
    this.beanUpdateService = new AccountUpdateService(http, type);

    this.categories$ = new CategoryListService(
      http,
      activatedRoute.snapshot.data['categoryType'],
    ).findAll();
  }

  createBean(): Account {
    return new Account(
      this.formGroup.value.inputDescription,
      this.formGroup.value.selectCategory.description,
    );
  }
}
