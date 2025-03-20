import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Owner } from './owner';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerService } from './owner-service';
import { DetailField } from "../field/detail-field.component";

@Component({
  selector: 'owner-detail',
  imports: [CommonModule, ButtonModule, PanelModule, DetailField],
  template: `
    <p-panel header="Detail">
      <a-detail-field strong="Name" value="{{ bean.name }}"/>

      <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
      <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
    </p-panel>
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
