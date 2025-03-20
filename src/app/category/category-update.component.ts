import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { Category } from './category';
import { CategoryService } from './category-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { HttpClient } from '@angular/common/http';
import { InputField } from '../field/input-field.component';

@Component({
  selector: 'category-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <a-input-field label="Description" 
          [autoFocus]=true
          [control]="form.get('inputDescription')!" />

        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the category"/>
        <p-button icon="pi pi-list" (onClick)="cancelToList()" [style]="{'margin-right': '10px'}" pTooltip="Cancel to list"/>
        <p-button icon="pi pi-search" (onClick)="cancelToDetail()" pTooltip="Cancel to detail"/>
      </p-panel>
    </form>
  `
})
export class CategoryUpdateComponent extends BeanUpdateComponent<Category, Category, Category> {

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, formBuilder, new CategoryService(http, route.snapshot.data['type']), createForm, createBean)
  }

}

function createForm(formBuilder: FormBuilder, bean: Category): FormGroup {
  return formBuilder.group({
    inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup): Category {
  return new Category(form.value.inputDescription)
}
