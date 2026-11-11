import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FotterComponent } from './fotter/fotter.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    FotterComponent
  ],
  imports: [
    
    CommonModule,
    RouterModule,
    FormsModule
   
  ],
  exports: [
      NavbarComponent,
      SidebarComponent,
      BreadcrumbsComponent,
      FotterComponent
  ]
})
export class SharedModule { }
