import { Routes } from '@angular/router';
import { OwnerInsertComponent } from './owner/owner-insert.component';
import { OwnerListComponent } from './owner/owner-list.component';
import { LoginPageComponent } from './auth/login-page.component';
import { OwnerUpdateComponent } from './owner/owner-update.component';
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
import { createCrudRoutes } from './route-config';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  createCrudRoutes({
    path: 'balances',
    title: 'Balances',
    titleClass: 'blue',
    listComponent: BalanceListComponent,
    insertComponent: OwnerEquityAccountInitialValueInsertComponent,
    updateComponent: OwnerEquityAccountInitialValueUpdateComponent,
    detailComponent: BalanceDetailComponent,
  }),
  createCrudRoutes({
    path: 'creditEntries',
    title: 'Credit Entries',
    titleClass: 'green',
    listComponent: EntryListComponent,
    insertComponent: EntryInsertComponent,
    updateComponent: EntryUpdateComponent,
    detailComponent: EntryDetailComponent,
    type: 'Credit',
    inAccountType: 'Equity',
    outAccountType: 'Credit',
  }),
  createCrudRoutes({
    path: 'debitEntries',
    title: 'Debit Entries',
    titleClass: 'red',
    listComponent: EntryListComponent,
    insertComponent: EntryInsertComponent,
    updateComponent: EntryUpdateComponent,
    detailComponent: EntryDetailComponent,
    type: 'Debit',
    inAccountType: 'Debit',
    outAccountType: 'Equity',
  }),
  createCrudRoutes({
    path: 'transferEntries',
    title: 'Transfer Entries',
    titleClass: 'blue',
    listComponent: EntryListComponent,
    insertComponent: EntryInsertComponent,
    updateComponent: EntryUpdateComponent,
    detailComponent: EntryDetailComponent,
    type: 'Transfer',
    inAccountType: 'Equity',
    outAccountType: 'Equity',
  }),
  createCrudRoutes({
    path: 'creditAccounts',
    title: 'Credit Accounts',
    titleClass: 'green',
    listComponent: AccountListComponent,
    insertComponent: AccountInsertComponent,
    updateComponent: AccountUpdateComponent,
    detailComponent: AccountDetailComponent,
    type: 'Credit',
    categoryType: 'Credit',
  }),
  createCrudRoutes({
    path: 'debitAccounts',
    title: 'Debit Accounts',
    titleClass: 'red',
    listComponent: AccountListComponent,
    insertComponent: AccountInsertComponent,
    updateComponent: AccountUpdateComponent,
    detailComponent: AccountDetailComponent,
    type: 'Debit',
    categoryType: 'Debit',
  }),
  createCrudRoutes({
    path: 'equityAccounts',
    title: 'Equity Accounts',
    titleClass: 'blue',
    listComponent: AccountListComponent,
    insertComponent: AccountInsertComponent,
    updateComponent: AccountUpdateComponent,
    detailComponent: AccountDetailComponent,
    type: 'Equity',
    categoryType: 'Equity',
  }),
  createCrudRoutes({
    path: 'creditCategories',
    title: 'Credit Categories',
    titleClass: 'green',
    listComponent: CategoryListComponent,
    insertComponent: CategoryInsertComponent,
    updateComponent: CategoryUpdateComponent,
    detailComponent: CategoryDetailComponent,
    type: 'Credit',
  }),
  createCrudRoutes({
    path: 'debitCategories',
    title: 'Debit Categories',
    titleClass: 'red',
    listComponent: CategoryListComponent,
    insertComponent: CategoryInsertComponent,
    updateComponent: CategoryUpdateComponent,
    detailComponent: CategoryDetailComponent,
    type: 'Debit',
  }),
  createCrudRoutes({
    path: 'equityCategories',
    title: 'Equity Categories',
    titleClass: 'blue',
    listComponent: CategoryListComponent,
    insertComponent: CategoryInsertComponent,
    updateComponent: CategoryUpdateComponent,
    detailComponent: CategoryDetailComponent,
    type: 'Equity',
  }),
  createCrudRoutes({
    path: 'owners',
    title: 'Owners',
    titleClass: 'blue',
    listComponent: OwnerListComponent,
    insertComponent: OwnerInsertComponent,
    updateComponent: OwnerUpdateComponent,
    detailComponent: OwnerDetailComponent,
  }),
  {
    path: 'ownerEquityAccountInitialValues/detail',
    redirectTo: 'balances/detail',
    pathMatch: 'full',
  },
  { path: 'ownerEquityAccountInitialValues', redirectTo: 'balances', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
