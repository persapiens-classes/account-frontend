import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Category } from './category';
import { CategoryService } from './category-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { HttpClient } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'category-edit',
  imports: [FloatLabelModule, ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <p-float-label variant="in" class="margin-bottom">
          <input id="description" 
            name="inputDescription"
            pInputText 
            [pAutoFocus]="true" 
            placeholder="Description to be edited" 
            formControlName="inputDescription" />
          <label for="description">Description</label>
        </p-float-label>
        <div
          *ngIf="form.get('inputDescription')?.invalid && (form.get('inputDescription')?.dirty || form.get('inputDescription')?.touched)"
          class="alert"
        >
          <div *ngIf="form.get('inputDescription')?.errors?.['required']">Description is required.</div>
          <div *ngIf="form.get('inputDescription')?.errors?.['minlength']">Description must be at least 3 characters long.</div>
        </div>

        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the category"/>
        <p-button icon="pi pi-times" (onClick)="cancelUpdate()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class CategoryUpdateComponent extends BeanUpdateComponent<Category, Category, Category> {

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, formBuilder, new CategoryService(http, route.snapshot.data['type']), createForm, createBean)
  }

}

function createForm(formBuilder: FormBuilder, bean: Category): FormGroup {
  return formBuilder.group({
    inputDescription: [bean.description, [Validators.required, Validators.minLength(3)]]
  })
}

function createBean(form: FormGroup): Category {
  return new Category(form.value.inputDescription)
}
