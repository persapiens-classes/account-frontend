import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from './entry';
import { BeanFormGroupService } from '../bean/bean-form-group.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntryFormGroupService extends BeanFormGroupService<Entry> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder)
  }

  createForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      inputDate: ['', [Validators.required]],
      selectInOwner: ['', [Validators.required]],
      selectInAccount: ['', [Validators.required]],
      selectOutOwner: ['', [Validators.required]],
      selectOutAccount: ['', [Validators.required]],
      inputValue: ['', [Validators.required]],
      inputNote: ['', []]
    })
  }
}

