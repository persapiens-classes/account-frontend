import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Owner } from './owner';
import { BeanFormGroupService } from '../bean/bean-form-group.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OwnerFormGroupService extends BeanFormGroupService<Owner> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  createForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      inputName: ['', [Validators.required, Validators.minLength(3)]]
    })
  }
}

