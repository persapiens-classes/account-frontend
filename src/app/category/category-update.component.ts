import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Category } from './category';
import { BeanUpdateComponent } from '../bean/bean-update.component';
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
export class CategoryUpdateComponent extends BeanUpdateComponent<Category> {
  form: FormGroup

  constructor(categoryFormGroupService: CategoryUpdateFormGroupService
  ) {
    super(createBean)

    this.form = categoryFormGroupService.form
  }

}

function createBean(form: FormGroup): Category {
  return new Category(form.value.inputDescription)
}
