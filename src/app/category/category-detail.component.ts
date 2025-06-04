import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { CategoryCreateService } from './category-create-service';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule, DetailFieldComponent],
  template: ` <app-detail-field strong="Description" value="{{ bean.description }}" /> `,
})
export class CategoryDetailComponent extends BeanDetailComponent<Category> {
  constructor() {
    super(new CategoryCreateService());
  }
}
