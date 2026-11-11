import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecordarComponent } from './recordar/recordar.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'recordar', component: RecordarComponent },
  { path: 'registrarse', component: RegistrarseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
