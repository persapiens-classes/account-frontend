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
import { EntryListComponent } from './entry/entry-list.component';
import { EntryInsertComponent } from './entry/entry-insert.component';
import { EntryUpdateComponent } from './entry/entry-update.component';
import { EntryDetailComponent } from './entry/entry-detail.component';
import { CategoryDetailComponent } from './category/category-detail.component';
import { AccountDetailComponent } from './account/account-detail.component';
import { OwnerDetailComponent } from './owner/owner-detail.component';
import { OwnerEquityAccountInitialValueListComponent } from './ownerEquityAccountInitialValue/ownerEquityAccountInitialValue-list.component';
import { OwnerEquityAccountInitialValueDetailComponent } from './ownerEquityAccountInitialValue/ownerEquityAccountInitialValue-detail.component';
import { OwnerEquityAccountInitialValueUpdateComponent } from './ownerEquityAccountInitialValue/ownerEquityAccountInitialValue-update.component';
import { OwnerEquityAccountInitialValueInsertComponent } from './ownerEquityAccountInitialValue/ownerEquityAccountInitialValue-insert.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'ownerEquityAccountInitialValues', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Initial Values' },
    children: [
      { path: 'list', component: OwnerEquityAccountInitialValueListComponent },
      { path: 'new', component: OwnerEquityAccountInitialValueInsertComponent },
      { path: 'edit', component: OwnerEquityAccountInitialValueUpdateComponent },
      { path: 'detail', component: OwnerEquityAccountInitialValueDetailComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditEntries', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Entries' },
    children: [
      { path: 'list', component: EntryListComponent, data: { type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'new', component: EntryInsertComponent, data: { type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'edit', component: EntryUpdateComponent, data: { type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'detail', component: EntryDetailComponent, data: { type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitEntries', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Entries' },
    children: [
      { path: 'list', component: EntryListComponent, data: { type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'new', component: EntryInsertComponent, data: { type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'edit', component: EntryUpdateComponent, data: { type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'detail', component: EntryDetailComponent, data: { type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'transferEntries', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Transfer Entries' },
    children: [
      { path: 'list', component: EntryListComponent, data: { type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'new', component: EntryInsertComponent, data: { type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'edit', component: EntryUpdateComponent, data: { type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'detail', component: EntryDetailComponent, data: { type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditAccounts', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Accounts' },
    children: [
      { path: 'list', component: AccountListComponent, data: { type: 'Credit' } },
      { path: 'new', component: AccountInsertComponent, data: { type: 'Credit' } },
      { path: 'edit', component: AccountUpdateComponent, data: { type: 'Credit' } },
      { path: 'detail', component: AccountDetailComponent, data: { type: 'Credit' } },
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
      { path: 'detail', component: AccountDetailComponent, data: { type: 'Debit' } },
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
      { path: 'detail', component: AccountDetailComponent, data: { type: 'Equity' } },
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
      { path: 'detail', component: CategoryDetailComponent, data: { type: 'Credit' } },
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
      { path: 'detail', component: CategoryDetailComponent, data: { type: 'Debit' } },
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
      { path: 'detail', component: CategoryDetailComponent, data: { type: 'Equity' } },
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
      { path: 'detail', component: OwnerDetailComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
