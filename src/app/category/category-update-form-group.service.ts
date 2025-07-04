import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, createCategory } from './category';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import { inject, Injectable } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class CategoryUpdateFormGroupService extends BeanUpdateFormGroupService<Category> {
  constructor() {
    super(inject(FormBuilder), createCategory, defaultJsonToBean, createForm);
  }
}

function createForm(formBuilder: FormBuilder, bean: Category): FormGroup {
  return formBuilder.group({
    inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]],
  });
}
