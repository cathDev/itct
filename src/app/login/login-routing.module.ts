import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from '../layout/dashboard/dashboard.component';
import {LayoutComponent} from '../layout/layout.component';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRoutingModule { }
