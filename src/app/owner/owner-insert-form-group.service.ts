import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Owner } from './owner';
import { Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerInsertFormGroupService extends BeanInsertFormGroupService<Owner> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  doCreateForm(): FormGroup {
    return this.formBuilder.group({
      inputName: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

}

