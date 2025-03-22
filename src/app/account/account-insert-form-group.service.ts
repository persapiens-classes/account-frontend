import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from './account';
import { Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root'
})
export class AccountInsertFormGroupService extends BeanInsertFormGroupService<Account> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  doCreateForm(): FormGroup {
    return this.formBuilder.group({
      inputDescription: ['', [Validators.required, Validators.minLength(3)]],
      selectCategory: ['', [Validators.required]]
    })
  }

}

