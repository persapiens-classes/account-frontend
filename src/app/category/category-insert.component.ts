import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { InputFieldComponent } from '../field/input-field.component';
import { CategoryInsertFormGroupService } from './category-insert-form-group.service';

@Component({
  selector: 'app-category-insert',
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent],
  template: `
    <app-input-field
      label="Description"
      [autoFocus]="true"
      [control]="form.get('inputDescription')!"
    />
  `,
})
export class CategoryInsertComponent implements BeanInsertComponent<Category> {
  form: FormGroup;

  constructor() {
    this.form = inject(CategoryInsertFormGroupService).form;
  }

  createBean(form: FormGroup): Category {
    return new Category(form.value.inputDescription);
  }
}
