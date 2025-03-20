import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { Owner } from './owner';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerService } from './owner-service';

@Component({
  selector: 'owner-detail',
  imports: [ButtonModule, InputTextModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule],
  template: `
      <p-panel header="Detail">
        <div class="margin-bottom detail-field">
          <strong>Name</strong>
          {{ bean.name }}
        </div>

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
