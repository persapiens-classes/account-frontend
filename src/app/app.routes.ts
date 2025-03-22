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
import { BeanDetailPanelComponent } from './bean/bean-detail-panel.component';
import { BeanListPanelComponent } from './bean/bean-list-panel.component';
import { BeanInsertPanelComponent } from './bean/bean-insert-panel.component';
import { OwnerUpdateFormGroupService } from './owner/owner-update-form-group.service';
import { CategoryUpdateFormGroupService } from './category/category-update-form-group.service';
import { AccountUpdateFormGroupService } from './account/account-update-form-group.service';
import { EntryUpdateFormGroupService } from './entry/entry-update-form-group.service';
import { BeanUpdatePanelComponent } from './bean/bean-update-panel.component';
import { OwnerEquityAccountInitialValueInsertFormGroupService } from './owner-equity-account-initial-value/owner-equity-account-initial-value-insert-form-group.service';
import { EntryInsertFormGroupService } from './entry/entry-insert-form-group.service';
import { AccountInsertFormGroupService } from './account/account-insert-form-group.service';
import { CategoryInsertFormGroupService } from './category/category-insert-form-group.service';
import { OwnerInsertFormGroupService } from './owner/owner-insert-form-group.service';
import { OwnerEquityAccountInitialValueUpdateFormGroupService } from './owner-equity-account-initial-value/owner-equity-account-initial-value-update-form-group.service';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'ownerEquityAccountInitialValues', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Balances', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: OwnerEquityAccountInitialValueListComponent } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: OwnerEquityAccountInitialValueInsertComponent, beanInsertFormGroupService: OwnerEquityAccountInitialValueInsertFormGroupService } },
      {
        path: 'edit', component: BeanUpdatePanelComponent, data: {
          beanUpdateComponent: OwnerEquityAccountInitialValueUpdateComponent, beanUpdateFormGroupService: OwnerEquityAccountInitialValueUpdateFormGroupService
        }
      },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: OwnerEquityAccountInitialValueDetailComponent } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditEntries', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Entries', titleClass: 'green' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: EntryListComponent, type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: EntryInsertComponent, beanInsertFormGroupService: EntryInsertFormGroupService, type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: EntryUpdateComponent, beanUpdateFormGroupService: EntryUpdateFormGroupService, type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: EntryDetailComponent, type: 'Credit', inAccountType: 'Equity', outAccountType: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitEntries', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Entries', titleClass: 'red' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: EntryListComponent, type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: EntryInsertComponent, beanInsertFormGroupService: EntryInsertFormGroupService, type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: EntryUpdateComponent, beanUpdateFormGroupService: EntryUpdateFormGroupService, type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: EntryDetailComponent, type: 'Debit', inAccountType: 'Debit', outAccountType: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'transferEntries', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Transfer Entries', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: EntryListComponent, type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: EntryInsertComponent, beanInsertFormGroupService: EntryInsertFormGroupService, type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: EntryUpdateComponent, beanUpdateFormGroupService: EntryUpdateFormGroupService, type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: EntryDetailComponent, type: 'Transfer', inAccountType: 'Equity', outAccountType: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditAccounts', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Accounts', titleClass: 'green' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: AccountListComponent, type: 'Credit' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: AccountInsertComponent, beanInsertFormGroupService: AccountInsertFormGroupService, type: 'Credit' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: AccountUpdateComponent, beanUpdateFormGroupService: AccountUpdateFormGroupService, type: 'Credit' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: AccountDetailComponent, type: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitAccounts', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Accounts', titleClass: 'red' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: AccountListComponent, type: 'Debit' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: AccountInsertComponent, beanInsertFormGroupService: AccountInsertFormGroupService, type: 'Debit' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: AccountUpdateComponent, beanUpdateFormGroupService: AccountUpdateFormGroupService, type: 'Debit' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: AccountDetailComponent, type: 'Debit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'equityAccounts', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Equity Accounts', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: AccountListComponent, type: 'Equity' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: AccountInsertComponent, beanInsertFormGroupService: AccountInsertFormGroupService, type: 'Equity' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: AccountUpdateComponent, beanUpdateFormGroupService: AccountUpdateFormGroupService, type: 'Equity' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: AccountDetailComponent, type: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'creditCategories', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Categories', titleClass: 'green' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: CategoryListComponent, type: 'Credit' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: CategoryInsertComponent, beanInsertFormGroupService: CategoryInsertFormGroupService, type: 'Credit' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: CategoryUpdateComponent, beanUpdateFormGroupService: CategoryUpdateFormGroupService, type: 'Credit' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: CategoryDetailComponent, type: 'Credit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'debitCategories', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Categories', titleClass: 'red' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: CategoryListComponent, type: 'Debit' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: CategoryInsertComponent, beanInsertFormGroupService: CategoryInsertFormGroupService, type: 'Debit' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: CategoryUpdateComponent, beanUpdateFormGroupService: CategoryUpdateFormGroupService, type: 'Debit' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: CategoryDetailComponent, type: 'Debit' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'equityCategories', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Equity Categories', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: CategoryListComponent, type: 'Equity' } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: CategoryInsertComponent, beanInsertFormGroupService: CategoryInsertFormGroupService, type: 'Equity' } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: CategoryUpdateComponent, beanUpdateFormGroupService: CategoryUpdateFormGroupService, type: 'Equity' } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: CategoryDetailComponent, type: 'Equity' } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'owners', component: CrudBeanPageComponent, canActivate: [AuthGuard],
    data: { title: 'Owners', titleClass: 'blue' },
    children: [
      { path: 'list', component: BeanListPanelComponent, data: { beanListComponent: OwnerListComponent } },
      { path: 'new', component: BeanInsertPanelComponent, data: { beanInsertComponent: OwnerInsertComponent, beanInsertFormGroupService: OwnerInsertFormGroupService } },
      { path: 'edit', component: BeanUpdatePanelComponent, data: { beanUpdateComponent: OwnerUpdateComponent, beanUpdateFormGroupService: OwnerUpdateFormGroupService } },
      { path: 'detail', component: BeanDetailPanelComponent, data: { beanDetailComponent: OwnerDetailComponent } },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
