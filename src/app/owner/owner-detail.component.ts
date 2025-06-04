import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerCreateService } from './owner-create-service';

@Component({
  selector: 'app-owner-detail',
  imports: [CommonModule, DetailFieldComponent],
  template: ` <app-detail-field strong="Name" value="{{ bean.name }}" /> `,
})
export class OwnerDetailComponent extends BeanDetailComponent<Owner> {
  constructor() {
    super(new OwnerCreateService());
  }
}
