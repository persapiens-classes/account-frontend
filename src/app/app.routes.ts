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
import { BalanceListComponent } from './balance/balance-list.component';
import { BalanceDetailComponent } from './balance/balance-detail.component';
import { OwnerEquityAccountInitialValueUpdateComponent } from './balance/owner-equity-account-initial-value-update.component';
import { OwnerEquityAccountInitialValueInsertComponent } from './balance/owner-equity-account-initial-value-insert.component';
import { OwnerDetailComponent } from './owner/owner-detail.component';
import { createCrudRoutes } from './route-config';
import { CategoryType } from './category/category';
import { AccountType } from './account/account';
import { EntryType } from './entry/entry';
import { TitleColor } from './layout/layout.component';
import { detailPath, PATHS } from './app.paths';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  createCrudRoutes({
    path: PATHS.BALANCE_PATH,
    title: 'Balances',
    titleColor: TitleColor.BLUE,
    list: { component: BalanceListComponent },
    insert: { component: OwnerEquityAccountInitialValueInsertComponent },
    update: { component: OwnerEquityAccountInitialValueUpdateComponent },
    detail: { component: BalanceDetailComponent },
  }),
  createCrudRoutes({
    path: `credit${PATHS.ENTRY_PATH}`,
    title: `${EntryType.CREDIT} Entries`,
    titleColor: TitleColor.GREEN,
    list: { component: EntryListComponent },
    insert: { component: EntryInsertComponent },
    update: { component: EntryUpdateComponent },
    detail: { component: EntryDetailComponent },
    type: EntryType.CREDIT,
    inAccountType: AccountType.EQUITY,
    outAccountType: AccountType.CREDIT,
  }),
  createCrudRoutes({
    path: `debit${PATHS.ENTRY_PATH}`,
    title: `${EntryType.DEBIT} Entries`,
    titleColor: TitleColor.RED,
    list: { component: EntryListComponent },
    insert: { component: EntryInsertComponent },
    update: { component: EntryUpdateComponent },
    detail: { component: EntryDetailComponent },
    type: EntryType.DEBIT,
    inAccountType: AccountType.DEBIT,
    outAccountType: AccountType.EQUITY,
  }),
  createCrudRoutes({
    path: `transfer${PATHS.ENTRY_PATH}`,
    title: `${EntryType.TRANSFER} Entries`,
    titleColor: TitleColor.BLUE,
    list: { component: EntryListComponent },
    insert: { component: EntryInsertComponent },
    update: { component: EntryUpdateComponent },
    detail: { component: EntryDetailComponent },
    type: EntryType.TRANSFER,
    inAccountType: AccountType.EQUITY,
    outAccountType: AccountType.EQUITY,
  }),
  createCrudRoutes({
    path: `credit${PATHS.ACCOUNT_PATH}`,
    title: `${AccountType.CREDIT} Accounts`,
    titleColor: TitleColor.GREEN,
    list: { component: AccountListComponent },
    insert: { component: AccountInsertComponent },
    update: { component: AccountUpdateComponent },
    detail: { component: AccountDetailComponent },
    type: AccountType.CREDIT,
    categoryType: CategoryType.CREDIT,
  }),
  createCrudRoutes({
    path: `debit${PATHS.ACCOUNT_PATH}`,
    title: `${AccountType.DEBIT} Accounts`,
    titleColor: TitleColor.RED,
    list: { component: AccountListComponent },
    insert: { component: AccountInsertComponent },
    update: { component: AccountUpdateComponent },
    detail: { component: AccountDetailComponent },
    type: AccountType.DEBIT,
    categoryType: CategoryType.DEBIT,
  }),
  createCrudRoutes({
    path: `equity${PATHS.ACCOUNT_PATH}`,
    title: `${AccountType.EQUITY} Accounts`,
    titleColor: TitleColor.BLUE,
    list: { component: AccountListComponent },
    insert: { component: AccountInsertComponent },
    update: { component: AccountUpdateComponent },
    detail: { component: AccountDetailComponent },
    type: AccountType.EQUITY,
    categoryType: CategoryType.EQUITY,
  }),
  createCrudRoutes({
    path: `credit${PATHS.CATEGORY_PATH}`,
    title: `${CategoryType.CREDIT} Categories`,
    titleColor: TitleColor.GREEN,
    list: { component: CategoryListComponent },
    insert: { component: CategoryInsertComponent },
    update: { component: CategoryUpdateComponent },
    detail: { component: CategoryDetailComponent },
    type: CategoryType.CREDIT,
  }),
  createCrudRoutes({
    path: `debit${PATHS.CATEGORY_PATH}`,
    title: `${CategoryType.DEBIT} Categories`,
    titleColor: TitleColor.RED,
    list: { component: CategoryListComponent },
    insert: { component: CategoryInsertComponent },
    update: { component: CategoryUpdateComponent },
    detail: { component: CategoryDetailComponent },
    type: CategoryType.DEBIT,
  }),
  createCrudRoutes({
    path: `equity${PATHS.CATEGORY_PATH}`,
    title: `${CategoryType.EQUITY} Categories`,
    titleColor: TitleColor.BLUE,
    list: { component: CategoryListComponent },
    insert: { component: CategoryInsertComponent },
    update: { component: CategoryUpdateComponent },
    detail: { component: CategoryDetailComponent },
    type: CategoryType.EQUITY,
  }),
  createCrudRoutes({
    path: PATHS.OWNER_PATH,
    title: 'Owners',
    titleColor: TitleColor.BLUE,
    list: { component: OwnerListComponent },
    insert: { component: OwnerInsertComponent },
    update: { component: OwnerUpdateComponent },
    detail: { component: OwnerDetailComponent },
  }),
  {
    path: `${detailPath(PATHS.OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_PATH)}`,
    redirectTo: `${detailPath(PATHS.BALANCE_PATH)}`,
    pathMatch: 'full',
  },
  {
    path: PATHS.OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_PATH,
    redirectTo: PATHS.BALANCE_PATH,
    pathMatch: 'full',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
