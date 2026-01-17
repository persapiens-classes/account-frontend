import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Category, createCategory } from './category';
import { InputFieldComponent } from '../field/input-field.component';
import { toBeanFromHistory } from '../bean/bean';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryUpdateService } from './category-update-service';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-category-update',
  imports: [ButtonModule, PanelModule, CommonModule, InputFieldComponent, BeanUpdatePanelComponent],
  template: `
    <app-bean-update-panel
      [form]="form"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-input-field
        label="Description"
        [autoFocus]="true"
        [formField]="form.description"
        dataCy="input-description"
      />
    </app-bean-update-panel>
  `,
})
export class CategoryUpdateComponent {
  form = form(signal(toBeanFromHistory(createCategory)), (f) => {
    required(f.description);
    minLength(f.description, 3);
  });
  beanFromHistory = toBeanFromHistory(createCategory);
  routerName: string;
  beanName: string;
  beanUpdateService: CategoryUpdateService;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Categories`;
    this.beanName = `${type} Category`;
    const http = inject(HttpClient);
    this.beanUpdateService = new CategoryUpdateService(http, type);
  }

  createBean(): Category {
    return new Category(this.form().value().description);
  }
}
