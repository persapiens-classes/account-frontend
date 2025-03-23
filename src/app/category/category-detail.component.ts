import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { CategoryCreateService } from './category-create-service';

@Component({
  selector: 'category-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Description" value="{{ bean.description }}"/>
  `
})
export class CategoryDetailComponent extends BeanDetailComponent<Category, Category, Category> {
  constructor() {
    super(new CategoryCreateService())
  }

}
