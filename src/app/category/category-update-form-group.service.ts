import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from './category';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import { Injectable } from '@angular/core';
import { CategoryCreateService } from './category-create-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryUpdateFormGroupService extends BeanUpdateFormGroupService<Category> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder, new CategoryCreateService())
  }

  doCreateForm(bean: Category): FormGroup {
    return this.formBuilder.group({
      inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]]
    })
  }

}

