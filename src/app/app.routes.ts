import { Routes } from '@angular/router';
import { OwnerInsertComponent } from './owner/owner-insert.component';
import { OwnerListComponent } from './owner/owner-list.component';
import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/auth.guard';
import { OwnerUpdateComponent } from './owner/owner-update.component';
import { BeanComponent } from './bean.component';
import { CategoryListComponent } from './category/category-list.component';
import { CategoryInsertComponent } from './category/category-insert.component';
import { CategoryUpdateComponent } from './category/category-update.component';
import { AccountListComponent } from './account/account-list.component';
import { AccountInsertComponent } from './account/account-insert.component';
import { AccountUpdateComponent } from './account/account-update.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'creditAccounts', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Accounts' },
    children: [
      { path: 'list', component: AccountListComponent, data: { type: 'Credit' } },
      { path: 'new', component: AccountInsertComponent, data: { type: 'Credit' } },
      { path: 'edit', component: AccountUpdateComponent, data: { type: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitAccounts', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Accounts' },
    children: [
      { path: 'list', component: AccountListComponent, data: { type: 'Debit' } },
      { path: 'new', component: AccountInsertComponent, data: { type: 'Debit' } },
      { path: 'edit', component: AccountUpdateComponent, data: { type: 'Debit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'equityAccounts', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Equity Accounts' },
    children: [
      { path: 'list', component: AccountListComponent, data: { type: 'Equity' } },
      { path: 'new', component: AccountInsertComponent, data: { type: 'Equity' } },
      { path: 'edit', component: AccountUpdateComponent, data: { type: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditCategories', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Categories' },
    children: [
      { path: 'list', component: CategoryListComponent, data: { type: 'Credit' } },
      { path: 'new', component: CategoryInsertComponent, data: { type: 'Credit' } },
      { path: 'edit', component: CategoryUpdateComponent, data: { type: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitCategories', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Categories' },
    children: [
      { path: 'list', component: CategoryListComponent, data: { type: 'Debit' } },
      { path: 'new', component: CategoryInsertComponent, data: { type: 'Debit' } },
      { path: 'edit', component: CategoryUpdateComponent, data: { type: 'Debit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'equityCategories', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Equity Categories' },
    children: [
      { path: 'list', component: CategoryListComponent, data: { type: 'Equity' } },
      { path: 'new', component: CategoryInsertComponent, data: { type: 'Equity' } },
      { path: 'edit', component: CategoryUpdateComponent, data: { type: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'owners', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Owners' },
    children: [
      { path: 'list', component: OwnerListComponent },
      { path: 'new', component: OwnerInsertComponent },
      { path: 'edit', component: OwnerUpdateComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
