import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Category } from './category';
import { CategoryService } from './category-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { HttpClient } from '@angular/common/http';
import { InputField } from '../field/input-field.component';
import { CategoryUpdateFormGroupService } from './category-update-form-group.service';

@Component({
  selector: 'category-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField],
  template: `
    <a-input-field label="Description" 
      [autoFocus]=true
      [control]="form.get('inputDescription')!" />
  `
})
export class CategoryUpdateComponent extends BeanUpdateComponent<Category, Category, Category> {
  form: FormGroup

  constructor(categoryFormGroupService: CategoryUpdateFormGroupService,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(new CategoryService(http, route.snapshot.data['type']))

    this.form = categoryFormGroupService.form
  }

  createBean(): Category {
    return new Category(this.form.value.inputDescription)
  }

}
