import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeanFormGroupService } from '../bean/bean-form-group.service';
import { OwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OwnerEquityAccountInitialValueFormGroupService extends BeanFormGroupService<OwnerEquityAccountInitialValue> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  createForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      selectOwner: ['', [Validators.required]],
      selectEquityAccount: ['', [Validators.required]],
      inputValue: ['', [Validators.required]]
    })
  }
}

