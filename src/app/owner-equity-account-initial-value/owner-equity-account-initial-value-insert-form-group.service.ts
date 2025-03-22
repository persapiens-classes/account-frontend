import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerEquityAccountInitialValueInsertFormGroupService extends BeanInsertFormGroupService<OwnerEquityAccountInitialValue> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  doCreateForm(): FormGroup {
    return this.formBuilder.group({
      selectOwner: ['', [Validators.required]],
      selectEquityAccount: ['', [Validators.required]],
      inputValue: ['', [Validators.required]]
    })
  }

}

