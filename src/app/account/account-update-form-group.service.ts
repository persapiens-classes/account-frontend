import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from './account';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import { Injectable } from '@angular/core';
import { Category } from '../category/category';
import { AccountCreateService } from './account-create-service';

@Injectable({
  providedIn: 'root'
})
export class AccountUpdateFormGroupService extends BeanUpdateFormGroupService<Account> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder, new AccountCreateService())
  }

  doCreateForm(bean: Account): FormGroup {
    return this.formBuilder.group({
      inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]],
      selectCategory: [new Category(bean.category), [Validators.required]]
    })
  }

}

