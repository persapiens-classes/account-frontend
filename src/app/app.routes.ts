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
import { CategoryType } from './category/category';
import { AccountType } from './account/account';
import { EntryType } from './entry/entry';
import { TitleColor } from './layout/layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  createCrudRoutes({
    path: 'balances',
    title: 'Balances',
    titleColor: TitleColor.BLUE,
    listComponent: BalanceListComponent,
    insertComponent: OwnerEquityAccountInitialValueInsertComponent,
    updateComponent: OwnerEquityAccountInitialValueUpdateComponent,
    detailComponent: BalanceDetailComponent,
  }),
  createCrudRoutes({
    path: 'creditEntries',
    title: `${EntryType.CREDIT} Entries`,
    titleColor: TitleColor.GREEN,
    listComponent: EntryListComponent,
    insertComponent: EntryInsertComponent,
    updateComponent: EntryUpdateComponent,
    detailComponent: EntryDetailComponent,
    type: EntryType.CREDIT,
    inAccountType: AccountType.EQUITY,
    outAccountType: AccountType.CREDIT,
  }),
  createCrudRoutes({
    path: 'debitEntries',
    title: `${EntryType.DEBIT} Entries`,
    titleColor: TitleColor.RED,
    listComponent: EntryListComponent,
    insertComponent: EntryInsertComponent,
    updateComponent: EntryUpdateComponent,
    detailComponent: EntryDetailComponent,
    type: EntryType.DEBIT,
    inAccountType: AccountType.DEBIT,
    outAccountType: AccountType.EQUITY,
  }),
  createCrudRoutes({
    path: 'transferEntries',
    title: `${EntryType.TRANSFER} Entries`,
    titleColor: TitleColor.BLUE,
    listComponent: EntryListComponent,
    insertComponent: EntryInsertComponent,
    updateComponent: EntryUpdateComponent,
    detailComponent: EntryDetailComponent,
    type: EntryType.TRANSFER,
    inAccountType: AccountType.EQUITY,
    outAccountType: AccountType.EQUITY,
  }),
  createCrudRoutes({
    path: 'creditAccounts',
    title: `${AccountType.CREDIT} Accounts`,
    titleColor: TitleColor.GREEN,
    listComponent: AccountListComponent,
    insertComponent: AccountInsertComponent,
    updateComponent: AccountUpdateComponent,
    detailComponent: AccountDetailComponent,
    type: AccountType.CREDIT,
    categoryType: CategoryType.CREDIT,
  }),
  createCrudRoutes({
    path: 'debitAccounts',
    title: `${AccountType.DEBIT} Accounts`,
    titleColor: TitleColor.RED,
    listComponent: AccountListComponent,
    insertComponent: AccountInsertComponent,
    updateComponent: AccountUpdateComponent,
    detailComponent: AccountDetailComponent,
    type: AccountType.DEBIT,
    categoryType: CategoryType.DEBIT,
  }),
  createCrudRoutes({
    path: 'equityAccounts',
    title: `${AccountType.EQUITY} Accounts`,
    titleColor: TitleColor.BLUE,
    listComponent: AccountListComponent,
    insertComponent: AccountInsertComponent,
    updateComponent: AccountUpdateComponent,
    detailComponent: AccountDetailComponent,
    type: AccountType.EQUITY,
    categoryType: CategoryType.EQUITY,
  }),
  createCrudRoutes({
    path: 'creditCategories',
    title: `${CategoryType.CREDIT} Categories`,
    titleColor: TitleColor.GREEN,
    listComponent: CategoryListComponent,
    insertComponent: CategoryInsertComponent,
    updateComponent: CategoryUpdateComponent,
    detailComponent: CategoryDetailComponent,
    type: CategoryType.CREDIT,
  }),
  createCrudRoutes({
    path: 'debitCategories',
    title: `${CategoryType.DEBIT} Categories`,
    titleColor: TitleColor.RED,
    listComponent: CategoryListComponent,
    insertComponent: CategoryInsertComponent,
    updateComponent: CategoryUpdateComponent,
    detailComponent: CategoryDetailComponent,
    type: CategoryType.DEBIT,
  }),
  createCrudRoutes({
    path: 'equityCategories',
    title: `${CategoryType.EQUITY} Categories`,
    titleColor: TitleColor.BLUE,
    listComponent: CategoryListComponent,
    insertComponent: CategoryInsertComponent,
    updateComponent: CategoryUpdateComponent,
    detailComponent: CategoryDetailComponent,
    type: CategoryType.EQUITY,
  }),
  createCrudRoutes({
    path: 'owners',
    title: 'Owners',
    titleColor: TitleColor.BLUE,
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
