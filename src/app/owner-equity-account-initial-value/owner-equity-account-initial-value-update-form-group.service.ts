import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import { OwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { Injectable } from '@angular/core';
import { OwnerEquityAccountInitialValueCreateService } from './owner-equity-account-initial-value-create-service';

@Injectable({
  providedIn: 'root'
})
export class OwnerEquityAccountInitialValueUpdateFormGroupService extends BeanUpdateFormGroupService<OwnerEquityAccountInitialValue> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder, new OwnerEquityAccountInitialValueCreateService(), createForm)
  }

}

function createForm(formBuilder: FormBuilder, bean: OwnerEquityAccountInitialValue): FormGroup {
  return formBuilder.group({
    inputValue: [bean.value, [Validators.required]]
  })
}

