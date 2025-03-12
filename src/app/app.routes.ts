import { Routes } from '@angular/router';
import { OwnerInsertComponent } from './owner-insert.component';
import { OwnerListComponent } from './owner-list.component';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth.guard';
import { OwnerUpdateComponent } from './owner-update.component';
import { BeanComponent } from './bean.component';
import { CategoryListComponent } from './category-list.component';
import { CategoryInsertComponent } from './category-insert.component';
import { CategoryUpdateComponent } from './category-update.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'owners', component: BeanComponent, canActivate: [AuthGuard],
      data: { title: 'Owners' },
      children: [
        { path: 'list', component: OwnerListComponent },
        { path: 'new', component: OwnerInsertComponent },
        { path: 'edit', component: OwnerUpdateComponent },
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
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '**', redirectTo: 'login'}
];
