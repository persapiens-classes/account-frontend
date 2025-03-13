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
import { CreditAccountListComponent } from './creditAccount/creditAccount-list.component';
import { CreditAccountInsertComponent } from './creditAccount/creditAccount-insert.component';
import { CreditAccountUpdateComponent } from './creditAccount/creditAccount-update.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'creditAccounts', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Accounts' },
    children: [
      { path: 'list', component: CreditAccountListComponent },
      { path: 'new', component: CreditAccountInsertComponent },
      { path: 'edit', component: CreditAccountUpdateComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: 'categories', component: BeanComponent, canActivate: [AuthGuard],
      data: { title: 'Categories' },
      children: [
        { path: 'list', component: CategoryListComponent },
        { path: 'new', component: CategoryInsertComponent },
        { path: 'edit', component: CategoryUpdateComponent },
        { path: '', redirectTo: 'list', pathMatch: 'full' }
      ]
  },
  { path: 'owners', component: BeanComponent, canActivate: [AuthGuard],
    data: { title: 'Owners' },
    children: [
      { path: 'list', component: OwnerListComponent },
      { path: 'new', component: OwnerInsertComponent },
      { path: 'edit', component: OwnerUpdateComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '**', redirectTo: 'login'}
];
