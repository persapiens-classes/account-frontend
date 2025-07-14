import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-category-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    CommonModule,
    InputFieldComponent,
    BeanUpdatePanelComponent,
  ],
  template: `
    <app-bean-update-panel
      [formGroup]="formGroup"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-input-field
        label="Description"
        [autoFocus]="true"
        [control]="formGroup.get('inputDescription')!"
      />
    </app-bean-update-panel>
  `,
})
export class CategoryUpdateComponent {
  formGroup: FormGroup;
  beanFromHistory: Category;
  routerName: string;
  beanName: string;
  beanUpdateService: CategoryUpdateService;

  constructor() {
    this.beanFromHistory = toBeanFromHistory(createCategory);
    this.formGroup = inject(FormBuilder).group({
      inputDescription: [
        this.beanFromHistory.description,
        [Validators.required, Validators.minLength(3)],
      ],
    });

    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Categories`;
    this.beanName = `${type} Category`;
    const http = inject(HttpClient);
    this.beanUpdateService = new CategoryUpdateService(http, type);
  }

  createBean(): Category {
    return new Category(this.formGroup.value.inputDescription);
  }
}
