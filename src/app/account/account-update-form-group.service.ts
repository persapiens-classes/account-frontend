import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account, createAccount } from './account';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import { inject, Injectable } from '@angular/core';
import { Category } from '../category/category';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class AccountUpdateFormGroupService extends BeanUpdateFormGroupService<Account> {
  constructor() {
    super(inject(FormBuilder), createAccount, defaultJsonToBean, createForm);
  }
}

function createForm(formBuilder: FormBuilder, bean: Account): FormGroup {
  return formBuilder.group({
    inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]],
    selectCategory: [new Category(bean.category), [Validators.required]],
  });
}
