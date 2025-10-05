import { Route } from '@angular/router';
import { LayoutComponent, TitleColor } from './layout/layout.component';
import { authGuard } from './auth/auth.guard';
import { Type } from '@angular/core';
import { CategoryType } from './category/category';
import { AccountType } from './account/account';
import { EntryType } from './entry/entry';

export interface RouteConfig {
  path: string;
  title: string;
  titleColor: TitleColor;
  listComponent: Type<unknown>;
  insertComponent: Type<unknown>;
  updateComponent: Type<unknown>;
  detailComponent: Type<unknown>;
  type?: CategoryType | AccountType | EntryType;
  categoryType?: CategoryType;
  inAccountType?: AccountType;
  outAccountType?: AccountType;
}

function createChildData(config: RouteConfig) {
  const baseData = config.type ? { type: config.type } : {};
  return {
    ...baseData,
    ...(config.categoryType && { categoryType: config.categoryType }),
    ...(config.inAccountType && { inAccountType: config.inAccountType }),
    ...(config.outAccountType && { outAccountType: config.outAccountType }),
  };
}

export function createCrudRoutes(config: RouteConfig): Route {
  const baseData = config.type ? { type: config.type } : {};
  const childData = createChildData(config);

  return {
    path: config.path,
    component: LayoutComponent,
    canActivate: [authGuard],
    data: { title: config.title, titleColor: config.titleColor },
    children: [
      {
        path: 'list',
        component: config.listComponent,
        data: baseData,
      },
      {
        path: 'new',
        component: config.insertComponent,
        data: childData,
      },
      {
        path: 'edit',
        component: config.updateComponent,
        data: childData,
      },
      {
        path: 'detail',
        component: config.detailComponent,
        data: baseData,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  };
}
