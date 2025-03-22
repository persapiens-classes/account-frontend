import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from './category';
import { Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryInsertFormGroupService extends BeanInsertFormGroupService<Category> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder, createForm)
  }
}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    inputDescription: ['', [Validators.required, Validators.minLength(3)]]
  })
}

