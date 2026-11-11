import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { TasksComponent } from './tasks/tasks.component';
const routes: Routes = [
  {
    path: 'dashboard', component: PagesComponent,
    children: [
       { path:  '', component: DashboardComponent },
       { path: 'users', component: UsersComponent },
       { path: 'roles', component: RolesComponent },
       { path: 'tasks',component:TasksComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
