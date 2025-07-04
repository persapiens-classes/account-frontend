import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
} from './owner-equity-account-initial-value';
import { inject, Injectable } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class OwnerEquityAccountInitialValueUpdateFormGroupService extends BeanUpdateFormGroupService<OwnerEquityAccountInitialValue> {
  constructor() {
    super(inject(FormBuilder), createOwnerEquityAccountInitialValue, defaultJsonToBean, createForm);
  }
}

function createForm(formBuilder: FormBuilder, bean: OwnerEquityAccountInitialValue): FormGroup {
  return formBuilder.group({
    inputInitialValue: [bean.initialValue, [Validators.required]],
  });
}
