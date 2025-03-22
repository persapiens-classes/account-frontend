import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';

@Component({
  selector: 'owner-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Name" value="{{ bean.name }}"/>
  `
})
export class OwnerDetailComponent extends BeanDetailComponent<Owner, Owner, Owner> {

  constructor(
    router: Router,
    ownerService: OwnerService
  ) {
    super(router, ownerService)
  }

}
