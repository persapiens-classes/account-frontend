import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerInsertFormGroupService extends BeanInsertFormGroupService {
  constructor() {
    super(inject(FormBuilder), createForm);
  }
}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    inputName: ['', [Validators.required, Validators.minLength(3)]],
  });
}
