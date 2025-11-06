import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, createCategory } from './category';
import { InputFieldComponent } from '../field/input-field.component';
import { CategoryInsertService } from './category-insert-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-category-insert',
  imports: [CommonModule, InputFieldComponent, BeanInsertPanelComponent],
  template: `
    <app-bean-insert-panel
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-input-fields label="Description" [autoFocus]="true" [field]="form.description" />
    </app-bean-insert-panel>
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
