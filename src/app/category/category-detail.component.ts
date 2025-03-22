import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from './category-service';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';

@Component({
  selector: 'category-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Description" value="{{ bean.description }}"/>
  `
})
export class CategoryDetailComponent extends BeanDetailComponent<Category, Category, Category> {
  constructor(
    router: Router,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, new CategoryService(http, route.snapshot.data['type']))
  }

}
