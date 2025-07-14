import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, createCategory } from './category';
import { DetailFieldComponent } from '../field/detail-field.component';
import { defaultJsonToBean, toBeanFromHistory } from '../bean/bean';
import { ActivatedRoute } from '@angular/router';
import { BeanDetailPanelComponent } from '../bean/bean-detail-panel.component';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule, DetailFieldComponent, BeanDetailPanelComponent],
  template: `
    <app-bean-detail-panel [routerName]="routerName" [bean]="bean">
      <app-detail-field strong="Description" value="{{ bean.description }}" />
    </app-bean-detail-panel>
  `,
})
export class CategoryDetailComponent {
  bean: Category;
  routerName: string;
  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Categories`;
    this.bean = toBeanFromHistory(createCategory, defaultJsonToBean);
  }
}
