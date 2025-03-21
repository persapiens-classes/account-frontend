import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from './account';
import { BeanFormGroupService } from '../bean/bean-form-group.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountFormGroupService extends BeanFormGroupService<Account> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  createForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      inputDescription: ['', [Validators.required, Validators.minLength(3)]],
      selectCategory: ['', [Validators.required]]
    })
  }
}

