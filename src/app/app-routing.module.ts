import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NopagesFoundComponent } from './nopages-found/nopages-found.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { AuthModule } from './auth/auth.module';
import { PagesComponent } from './pages/pages.component';
import { PagesRoutingModule } from './pages/pages-routing.module';


const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: NopagesFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
