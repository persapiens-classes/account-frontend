import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from './category';
import { BeanFormGroupService } from '../bean/bean-form-group.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryFormGroupService extends BeanFormGroupService<Category> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  createForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      inputDescription: ['', [Validators.required, Validators.minLength(3)]]
    })
  }
}

