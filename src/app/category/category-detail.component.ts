import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { CategoryService } from './category-service';
import { DetailField } from "../field/detail-field.component";

@Component({
  selector: `{{ type }}-category-detail`,
  imports: [CommonModule, ButtonModule, PanelModule, DetailField],
  template: `
    <p-panel header="Detail">
      <a-detail-field strong="Description" value="{{ bean.description }}"/>

      <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
      <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
    </p-panel>
  `
})
export class CategoryDetailComponent extends BeanDetailComponent<Category, Category, Category> {
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
