import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { CategoryService } from './category-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { HttpClient } from '@angular/common/http';
import { InputField } from "../field/input-field.component";
import { CategoryFormGroupService } from './category-form-group.service';

@Component({
  selector: 'category-insert',
  imports: [ReactiveFormsModule, CommonModule, InputField],
  template: `
    <a-input-field label="Description" 
      [autoFocus]=true
      [control]="form.get('inputDescription')!" />
  `
})
export class CategoryInsertComponent extends BeanInsertComponent<Category, Category, Category> {
  form: FormGroup

  constructor(categoryFormGroupService: CategoryFormGroupService,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(new CategoryService(http, route.snapshot.data['type']))

    this.form = categoryFormGroupService.getForm()
  }

  createBean(): Category {
    return new Category(this.form.value.inputDescription)
  }

}
