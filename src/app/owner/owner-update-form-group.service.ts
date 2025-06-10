import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createOwner, Owner } from './owner';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import { Injectable } from '@angular/core';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class OwnerUpdateFormGroupService extends BeanUpdateFormGroupService<Owner> {
  constructor(formBuilder: FormBuilder) {
    super(formBuilder, createOwner, defaultJsonToBean, createForm);
  }
}

function createForm(formBuilder: FormBuilder, bean: Owner): FormGroup {
  return formBuilder.group({
    inputName: [bean.name, [Validators.required, Validators.minLength(3)]],
  });
}
