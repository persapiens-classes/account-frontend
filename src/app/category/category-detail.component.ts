import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, createCategory } from './category';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { defaultJsonToBean } from '../bean/bean';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule, DetailFieldComponent],
  template: ` <app-detail-field strong="Description" value="{{ bean.description }}" /> `,
})
export class CategoryDetailComponent extends BeanDetailComponent<Category> {
  constructor() {
    super(createCategory, defaultJsonToBean);
  }
}
