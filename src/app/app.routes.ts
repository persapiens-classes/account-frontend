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
import { OwnerDetailComponent } from './owner/owner-detail.component';
import { OwnerEquityAccountInitialValueListComponent } from './owner-equity-account-initial-value/owner-equity-account-initial-value-list.component';
import { OwnerEquityAccountInitialValueDetailComponent } from './owner-equity-account-initial-value/owner-equity-account-initial-value-detail.component';
import { OwnerEquityAccountInitialValueUpdateComponent } from './owner-equity-account-initial-value/owner-equity-account-initial-value-update.component';
import { OwnerEquityAccountInitialValueInsertComponent } from './owner-equity-account-initial-value/owner-equity-account-initial-value-insert.component';
import { BeanDetailPainelComponent } from './bean/bean-detail-painel.component';
import { BeanListPainelComponent } from './bean/bean-list-painel.component';
import { BeanInsertPainelComponent } from './bean/bean-insert-painel.component';
import { OwnerFormGroupService } from './owner/owner-form-group.service';
import { CategoryFormGroupService } from './category/category-form-group.service';
import { AccountFormGroupService } from './account/account-form-group.service';
import { EntryFormGroupService } from './entry/entry-form-group.service';
import { OwnerEquityAccountInitialValueFormGroupService } from './owner-equity-account-initial-value/owner-equity-account-initial-value-form-group.service';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'ownerEquityAccountInitialValues', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Balances', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: OwnerEquityAccountInitialValueListComponent } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: OwnerEquityAccountInitialValueInsertComponent, beanFormGroupService: OwnerEquityAccountInitialValueFormGroupService } },
      { path: 'edit', component: OwnerEquityAccountInitialValueUpdateComponent },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: OwnerEquityAccountInitialValueDetailComponent } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditEntries', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Entries', titleClass: 'green' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: EntryListComponent, type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: EntryInsertComponent, beanFormGroupService: EntryFormGroupService, type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'edit', component: EntryUpdateComponent, data: { type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: EntryDetailComponent, type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitEntries', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Entries', titleClass: 'red' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: EntryListComponent, type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: EntryInsertComponent, beanFormGroupService: EntryFormGroupService, type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'edit', component: EntryUpdateComponent, data: { type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: EntryDetailComponent, type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'transferEntries', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Transfer Entries', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: EntryListComponent, type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: EntryInsertComponent, beanFormGroupService: EntryFormGroupService, type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'edit', component: EntryUpdateComponent, data: { type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: EntryDetailComponent, type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditAccounts', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Accounts', titleClass: 'green' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: AccountListComponent, type: 'Credit' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: AccountInsertComponent, beanFormGroupService: AccountFormGroupService, type: 'Credit' } },
      { path: 'edit', component: AccountUpdateComponent, data: { type: 'Credit' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: AccountDetailComponent, type: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitAccounts', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Accounts', titleClass: 'red' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: AccountListComponent, type: 'Debit' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: AccountInsertComponent, beanFormGroupService: AccountFormGroupService, type: 'Debit' } },
      { path: 'edit', component: AccountUpdateComponent, data: { type: 'Debit' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: AccountDetailComponent, type: 'Debit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'equityAccounts', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Equity Accounts', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: AccountListComponent, type: 'Equity' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: AccountInsertComponent, beanFormGroupService: AccountFormGroupService, type: 'Equity' } },
      { path: 'edit', component: AccountUpdateComponent, data: { type: 'Equity' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: AccountDetailComponent, type: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditCategories', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Categories', titleClass: 'green' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: CategoryListComponent, type: 'Credit' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: CategoryInsertComponent, beanFormGroupService: CategoryFormGroupService, type: 'Credit' } },
      { path: 'edit', component: CategoryUpdateComponent, data: { type: 'Credit' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: CategoryDetailComponent, type: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitCategories', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Categories', titleClass: 'red' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: CategoryListComponent, type: 'Debit' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: CategoryInsertComponent, beanFormGroupService: CategoryFormGroupService, type: 'Debit' } },
      { path: 'edit', component: CategoryUpdateComponent, data: { type: 'Debit' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: CategoryDetailComponent, type: 'Debit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'equityCategories', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Equity Categories', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: CategoryListComponent, type: 'Equity' } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: CategoryInsertComponent, beanFormGroupService: CategoryFormGroupService, type: 'Equity' } },
      { path: 'edit', component: CategoryUpdateComponent, data: { type: 'Equity' } },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: CategoryDetailComponent, type: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'owners', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Owners', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPainelComponent, data: { beanListComponent: OwnerListComponent } },
      { path: 'new', component: BeanInsertPainelComponent, data: { beanInsertComponent: OwnerInsertComponent, beanFormGroupService: OwnerFormGroupService } },
      { path: 'edit', component: OwnerUpdateComponent },
      { path: 'detail', component: BeanDetailPainelComponent, data: { beanDetailComponent: OwnerDetailComponent } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
