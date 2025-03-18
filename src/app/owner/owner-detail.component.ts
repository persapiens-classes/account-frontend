import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { Owner } from './owner';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerService } from './owner-service';

@Component({
  selector: 'owner-detail',
  imports: [ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
      <p-panel header="New">
        <label for="name">Name:</label>
        {{ bean.name }}
        <p-divider />
        <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
        <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
      </p-panel>
  `
})
export class OwnerDetailComponent extends BeanDetailComponent<Owner, Owner, string> {

  constructor(
    router: Router,
    ownerService: OwnerService
  ) {
    super(router, ownerService)
  }

}
