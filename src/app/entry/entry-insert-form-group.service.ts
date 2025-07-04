import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import { BeanInsertFormGroupService } from '../bean/bean-insert-form-group.service';

@Injectable({
  providedIn: 'root',
})
export class EntryInsertFormGroupService extends BeanInsertFormGroupService {
  constructor() {
    super(inject(FormBuilder), createForm);
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
    inputNote: ['', []],
  });
}
