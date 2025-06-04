import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { DetailField } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerCreateService } from './owner-create-service';

@Component({
  selector: 'owner-detail',
  imports: [CommonModule, DetailField],
  template: ` <a-detail-field strong="Name" value="{{ bean.name }}" /> `,
})
export class OwnerDetailComponent extends BeanDetailComponent<Owner> {
  constructor() {
    super(new OwnerCreateService());
  }
}
