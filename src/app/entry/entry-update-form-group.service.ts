import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from './entry';
import { BeanUpdateFormGroupService } from '../bean/bean-update-form-group.service';
import { Injectable } from '@angular/core';
import { Owner } from '../owner/owner';
import { Account } from '../account/account';
import { EntryCreateService } from './entry-create-service';

@Injectable({
  providedIn: 'root'
})
export class EntryUpdateFormGroupService extends BeanUpdateFormGroupService<Entry> {

  constructor(formBuilder: FormBuilder, entryCreateService: EntryCreateService
  ) {
    super(formBuilder, entryCreateService, createForm)
  }

}

function createForm(formBuilder: FormBuilder, bean: Entry): FormGroup {
  return formBuilder.group({
    inputDate: [bean.date, [Validators.required, Validators.minLength(3)]],
    selectInOwner: [new Owner(bean.inOwner), [Validators.required]],
    selectInAccount: [new Account(bean.inAccount.description, bean.inAccount.category), [Validators.required]],
    selectOutOwner: [new Owner(bean.outOwner), [Validators.required]],
    selectOutAccount: [new Account(bean.outAccount.description, bean.outAccount.category), [Validators.required]],
    inputValue: [bean.value, [Validators.required, Validators.minLength(3)]],
    inputNote: [bean.note, [Validators.required, Validators.minLength(3)]]
  })
}

