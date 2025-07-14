import { Routes } from '@angular/router';
import { OwnerInsertComponent } from './owner/owner-insert.component';
import { OwnerListComponent } from './owner/owner-list.component';
import { LoginPageComponent } from './auth/login-page.component';
import { AuthGuard } from './auth/auth.guard';
import { OwnerUpdateComponent } from './owner/owner-update.component';
import { CrudBeanPageComponent } from './crud-bean-page.component';
import { CategoryListComponent } from './category/category-list.component';
import { CategoryInsertComponent } from './category/category-insert.component';
import { CategoryUpdateComponent } from './category/category-update.component';
import { AccountListComponent } from './account/account-list.component';
import { AccountInsertComponent } from './account/account-insert.component';
import { AccountUpdateComponent } from './account/account-update.component';
import { EntryListComponent } from './entry/entry-list.component';
import { EntryInsertComponent } from './entry/entry-insert.component';
import { EntryUpdateComponent } from './entry/entry-update.component';
import { EntryDetailComponent } from './entry/entry-detail.component';
import { CategoryDetailComponent } from './category/category-detail.component';
import { AccountDetailComponent } from './account/account-detail.component';
import { BalanceListComponent } from './owner-equity-account-initial-value/balance-list.component';
import { BalanceDetailComponent } from './owner-equity-account-initial-value/balance-detail.component';
import { OwnerEquityAccountInitialValueUpdateComponent } from './owner-equity-account-initial-value/owner-equity-account-initial-value-update.component';
import { OwnerEquityAccountInitialValueInsertComponent } from './owner-equity-account-initial-value/owner-equity-account-initial-value-insert.component';
import { OwnerDetailComponent } from './owner/owner-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'balances',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Balances', titleClass: 'blue' },
    children: [
      {
        path: 'list',
        component: BalanceListComponent,
      },
      {
        path: 'new',
        component: OwnerEquityAccountInitialValueInsertComponent,
      },
      {
        path: 'edit',
        component: OwnerEquityAccountInitialValueUpdateComponent,
      },
      {
        path: 'detail',
        component: BalanceDetailComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'creditEntries',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Credit Entries', titleClass: 'green' },
    children: [
      {
        path: 'list',
        component: EntryListComponent,
        data: { type: 'Credit' },
      },
      {
        path: 'new',
        component: EntryInsertComponent,
        data: {
          type: 'Credit',
          inAccountType: 'Equity',
          outAccountType: 'Credit',
        },
      },
      {
        path: 'edit',
        component: EntryUpdateComponent,
        data: {
          type: 'Credit',
          inAccountType: 'Equity',
          outAccountType: 'Credit',
        },
      },
      {
        path: 'detail',
        component: EntryDetailComponent,
        data: {
          type: 'Credit',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'debitEntries',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Debit Entries', titleClass: 'red' },
    children: [
      {
        path: 'list',
        component: EntryListComponent,
        data: { type: 'Debit' },
      },
      {
        path: 'new',
        component: EntryInsertComponent,
        data: {
          type: 'Debit',
          inAccountType: 'Debit',
          outAccountType: 'Equity',
        },
      },
      {
        path: 'edit',
        component: EntryUpdateComponent,
        data: {
          type: 'Debit',
          inAccountType: 'Debit',
          outAccountType: 'Equity',
        },
      },
      {
        path: 'detail',
        component: EntryDetailComponent,
        data: {
          type: 'Debit',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'transferEntries',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Transfer Entries', titleClass: 'blue' },
    children: [
      {
        path: 'list',
        component: EntryListComponent,
        data: {
          type: 'Transfer',
        },
      },
      {
        path: 'new',
        component: EntryInsertComponent,
        data: {
          type: 'Transfer',
          inAccountType: 'Equity',
          outAccountType: 'Equity',
        },
      },
      {
        path: 'edit',
        component: EntryUpdateComponent,
        data: {
          type: 'Transfer',
          inAccountType: 'Equity',
          outAccountType: 'Equity',
        },
      },
      {
        path: 'detail',
        component: EntryDetailComponent,
        data: {
          type: 'Transfer',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'creditAccounts',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Credit Accounts', titleClass: 'green' },
    children: [
      {
        path: 'list',
        component: AccountListComponent,
        data: {
          type: 'Credit',
        },
      },
      {
        path: 'new',
        component: AccountInsertComponent,
        data: {
          type: 'Credit',
        },
      },
      {
        path: 'edit',
        component: AccountUpdateComponent,
        data: {
          type: 'Credit',
          categoryType: 'Credit',
        },
      },
      {
        path: 'detail',
        component: AccountDetailComponent,
        data: {
          type: 'Credit',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'debitAccounts',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Debit Accounts', titleClass: 'red' },
    children: [
      {
        path: 'list',
        component: AccountListComponent,
        data: {
          type: 'Debit',
        },
      },
      {
        path: 'new',
        component: AccountInsertComponent,
        data: {
          type: 'Debit',
        },
      },
      {
        path: 'edit',
        component: AccountUpdateComponent,
        data: {
          type: 'Debit',
          categoryType: 'Debit',
        },
      },
      {
        path: 'detail',
        component: AccountDetailComponent,
        data: {
          type: 'Debit',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'equityAccounts',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Equity Accounts', titleClass: 'blue' },
    children: [
      {
        path: 'list',
        component: AccountListComponent,
        data: {
          type: 'Equity',
        },
      },
      {
        path: 'new',
        component: AccountInsertComponent,
        data: {
          type: 'Equity',
        },
      },
      {
        path: 'edit',
        component: AccountUpdateComponent,
        data: {
          type: 'Equity',
          categoryType: 'Equity',
        },
      },
      {
        path: 'detail',
        component: AccountDetailComponent,
        data: {
          type: 'Equity',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'creditCategories',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Credit Categories', titleClass: 'green' },
    children: [
      {
        path: 'list',
        component: CategoryListComponent,
        data: {
          type: 'Credit',
        },
      },
      {
        path: 'new',
        component: CategoryInsertComponent,
        data: {
          type: 'Credit',
        },
      },
      {
        path: 'edit',
        component: CategoryUpdateComponent,
        data: {
          type: 'Credit',
        },
      },
      {
        path: 'detail',
        component: CategoryDetailComponent,
        data: {
          type: 'Credit',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'debitCategories',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Debit Categories', titleClass: 'red' },
    children: [
      {
        path: 'list',
        component: CategoryListComponent,
        data: {
          type: 'Debit',
        },
      },
      {
        path: 'new',
        component: CategoryInsertComponent,
        data: {
          type: 'Debit',
        },
      },
      {
        path: 'edit',
        component: CategoryUpdateComponent,
        data: {
          type: 'Debit',
        },
      },
      {
        path: 'detail',
        component: CategoryDetailComponent,
        data: {
          type: 'Debit',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'equityCategories',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Equity Categories', titleClass: 'blue' },
    children: [
      {
        path: 'list',
        component: CategoryListComponent,
        data: {
          type: 'Equity',
        },
      },
      {
        path: 'new',
        component: CategoryInsertComponent,
        data: {
          type: 'Equity',
        },
      },
      {
        path: 'edit',
        component: CategoryUpdateComponent,
        data: {
          type: 'Equity',
        },
      },
      {
        path: 'detail',
        component: CategoryDetailComponent,
        data: {
          type: 'Equity',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'owners',
    component: CrudBeanPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Owners', titleClass: 'blue' },
    children: [
      {
        path: 'list',
        component: OwnerListComponent,
      },
      {
        path: 'new',
        component: OwnerInsertComponent,
      },
      {
        path: 'edit',
        component: OwnerUpdateComponent,
      },
      {
        path: 'detail',
        component: OwnerDetailComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'ownerEquityAccountInitialValues/detail',
    redirectTo: 'balances/detail',
    pathMatch: 'full',
  },
  { path: 'ownerEquityAccountInitialValues', redirectTo: 'balances', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
