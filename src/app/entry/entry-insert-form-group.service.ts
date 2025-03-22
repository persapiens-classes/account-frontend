import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from './entry';
import { Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root'
})
export class EntryInsertFormGroupService extends BeanInsertFormGroupService<Entry> {

  constructor(formBuilder: FormBuilder
  ) {
    super(formBuilder, createForm)
  }

}

function createForm(formBuilder: FormBuilder): FormGroup {
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

