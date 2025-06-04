import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerEquityAccountInitialValueInsertFormGroupService extends BeanInsertFormGroupService<OwnerEquityAccountInitialValue> {
  constructor(formBuilder: FormBuilder) {
    super(formBuilder, createForm);
  }
}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    selectOwner: ['', [Validators.required]],
    selectEquityAccount: ['', [Validators.required]],
    inputInitialValue: ['', [Validators.required]],
  });
}
