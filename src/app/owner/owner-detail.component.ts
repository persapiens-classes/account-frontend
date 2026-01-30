import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createOwner, Owner } from './owner';
import { DetailFieldComponent } from '../field/detail-field.component';
import { toBeanFromHistory } from '../bean/bean';
import { BeanDetailPanelComponent } from '../bean/bean-detail-panel.component';

@Component({
  selector: 'app-owner-detail',
  imports: [CommonModule, DetailFieldComponent, BeanDetailPanelComponent],
  template: `
    <app-bean-detail-panel [routerName]="'owners'" [bean]="bean">
      <app-detail-field strong="Name" [value]="bean.name" dataCy="detail-name" />
    </app-bean-detail-panel>
  `,
})
export class OwnerDetailComponent {
  bean: Owner;

  constructor() {
    this.bean = toBeanFromHistory(createOwner);
  }
}
