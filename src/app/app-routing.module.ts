import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './shared/guard/auth-guard.service';

const routes: Routes = [
  {path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuardService]},
  {path: 'login', loadChildren: './login/login.module#LoginModule'},
  {path: 'inscription', loadChildren: './register/register.module#RegisterModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
