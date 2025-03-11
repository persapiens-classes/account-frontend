import { Routes } from '@angular/router';
import { OwnerInsertComponent } from './owner-insert.component';
import { OwnerListComponent } from './owner-list.component';
import { LoginComponent } from './login.component';
import { OwnerCrudComponent } from './owner-crud.component';
import { AuthGuard } from './auth.guard';
import { OwnerUpdateComponent } from './owner-update.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'owners', component: OwnerCrudComponent, canActivate: [AuthGuard],
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
