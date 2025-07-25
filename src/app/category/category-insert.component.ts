import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { InputFieldComponent } from '../field/input-field.component';
import { CategoryInsertService } from './category-insert-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';

@Component({
  selector: 'app-category-insert',
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent, BeanInsertPanelComponent],
  template: `
    <app-bean-insert-panel
      [formGroup]="formGroup"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-input-field label="Description" [autoFocus]="true" formControlName="inputDescription" />
    </app-bean-insert-panel>
  `,
})
export class CategoryInsertComponent {
  formGroup: FormGroup;
  routerName: string;
  beanName: string;
  beanInsertService: CategoryInsertService;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      inputDescription: ['', [Validators.required, Validators.minLength(3)]],
    });

    const activatedRoute = inject(ActivatedRoute);
    const http = inject(HttpClient);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Categories`;
    this.beanName = `${type} Category`;
    this.beanInsertService = new CategoryInsertService(http, type);
  }

  createBean(): Category {
    return new Category(this.formGroup.value.inputDescription);
  }
}
