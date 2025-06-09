import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root',
})
export class AccountInsertFormGroupService extends BeanInsertFormGroupService {
  constructor(formBuilder: FormBuilder) {
    super(formBuilder, createForm);
  }
}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    selectCategory: ['', [Validators.required]],
    inputDescription: ['', [Validators.required, Validators.minLength(3)]],
  });
}
