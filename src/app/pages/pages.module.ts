import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { TasksComponent } from './tasks/tasks.component';
import { AddrolesComponent } from '../modals/roles/addroles/addroles.component';
import { EditrolesComponent } from '../modals/roles/editroles/editroles.component';
import { EdittaskComponent } from '../modals/tasks/edittask/edittask.component';
import { AddtaskComponent } from '../modals/tasks/addtask/addtask.component';
import { AddtusersComponent } from '../modals/users/addtusers/addtusers.component';
import { EditusersComponent } from '../modals/users/editusers/editusers.component';
import { EdittaskusersComponent } from '../modals/taskusers/edittaskusers/edittaskusers.component';
import { AddtaskusersComponent } from '../modals/taskusers/addtaskusers/addtaskusers.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    UsersComponent,
       AddtusersComponent,
        EditusersComponent,
    RolesComponent,
    AddrolesComponent,
    EditrolesComponent,
    TasksComponent,
        EdittaskComponent,
        AddtaskComponent,
    EdittaskusersComponent,
             AddtaskusersComponent,  
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

    
     // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class PagesModule { }
