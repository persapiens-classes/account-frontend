import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, createCategory } from './category';
import { InputFieldSComponent } from '../field/input-fields.component';
import { CategoryInsertService } from './category-insert-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BeanInsertPanelsComponent } from '../bean/bean-insert-panels.component';
import { form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-category-insert',
  imports: [CommonModule, InputFieldSComponent, BeanInsertPanelsComponent],
  template: `
    <app-bean-insert-panels
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-input-fields label="Description" [autoFocus]="true" [field]="form.description" />
    </app-bean-insert-panels>
  `,
})
export class CategoryInsertComponent {
  form = form(signal(createCategory()), (f) => {
    required(f.description);
    minLength(f.description, 3);
  });
  routerName: string;
  beanName: string;
  beanInsertService: CategoryInsertService;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const http = inject(HttpClient);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Categories`;
    this.beanName = `${type} Category`;
    this.beanInsertService = new CategoryInsertService(http, type);
  }

  createBean(): Category {
    return new Category(this.form().value().description);
  }
}
