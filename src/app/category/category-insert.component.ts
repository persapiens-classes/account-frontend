import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { InputField } from '../field/input-field.component';
import { CategoryInsertFormGroupService } from './category-insert-form-group.service';

@Component({
  selector: 'category-insert',
  imports: [ReactiveFormsModule, CommonModule, InputField],
  template: `
    <a-input-field
      label="Description"
      [autoFocus]="true"
      [control]="form.get('inputDescription')!"
    />
  `,
})
export class CategoryInsertComponent extends BeanInsertComponent<Category> {
  form: FormGroup;

  constructor(categoryFormGroupService: CategoryInsertFormGroupService) {
    super(createBean);

    this.form = categoryFormGroupService.form;
  }
}

function createBean(form: FormGroup): Category {
  return new Category(form.value.inputDescription);
}
