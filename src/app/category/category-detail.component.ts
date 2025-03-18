import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { CategoryService } from './category-service';

@Component({
  selector: `{{ type }}Category-detail`,
  imports: [ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <p-panel header="Detail">
      <label for="description">Description:</label>
      {{ bean.description }}
      <p-divider />
      <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
      <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
    </p-panel>
  `
})
export class CategoryDetailComponent extends BeanDetailComponent<Category, Category, string> {
  type: string
  constructor(
    router: Router,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, new CategoryService(http, route.snapshot.data['type']))
    this.type = route.snapshot.data['type']
  }

}
