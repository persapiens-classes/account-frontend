import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { Category } from './category';
import { CategoryService } from './category-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { HttpClient } from '@angular/common/http';
import { InputField } from "../input-field.component";

@Component({
  selector: `{{ type }}Category-insert`,
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
        <a-input-field label="Description" 
            [autoFocus]=true
            [control]="form.get('inputDescription')!" />
        
        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the category"/>
        <p-button icon="pi pi-times" (onClick)="cancelInsert()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class CategoryInsertComponent extends BeanInsertComponent<Category, Category, Category> {
  type: string
  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, formBuilder, new CategoryService(http, route.snapshot.data['type']), createForm, createBean)
    this.type = route.snapshot.data['type']
  }

}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    inputDescription: ['', [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup): Category {
  return new Category(form.value.inputDescription)
}
