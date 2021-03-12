import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppointmentsComponent} from './appointments/appointments.component';
import {DoctorComponent} from './doctor/doctor.component';
import {PatientsComponent} from './patients/patients.component';
import {LaboratoireComponent} from './laboratoire/laboratoire.component';
import {ResultatTestComponent} from './resultat-test/resultat-test.component';
import {TestComponent} from './test/test.component';
import {ResultatVaccinComponent} from './resultat-vaccin/resultat-vaccin.component';
import {MesResultatsComponent} from './mes-resultats/mes-resultats.component';
import {ValidationTestComponent} from './validation-test/validation-test.component';
import {PreleveurComponent} from './preleveur/preleveur.component';
import {ControleurComponent} from './controleur/controleur.component';
import {AuthGuardService} from '../shared/guard/auth-guard.service';
import {LinkGuardService} from '../shared/guard/link-guard.service';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'appointments',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'appointments'
        },
        children: [
          { path:'', component: AppointmentsComponent }
        ]
      },
      {path: 'doctors', component: DoctorComponent},
      {
        path: 'patients',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'patients'
        },
        children: [
          { path:'', component: PatientsComponent }
        ]
      },
      {
        path: 'laboratoires',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'laboratoires'
        },
        children: [
          { path:'', component: LaboratoireComponent }
        ]
      },
      {
        path: 'resultat-test',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'resultat-test'
        },
        children: [
          { path:'', component: ResultatTestComponent }
        ]
      },
      {
        path: 'prendre-rendez-vous',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'prendre-rendez-vous'
        },
        children: [
          { path:'', component: TestComponent }
        ]
      },
      {
        path: 'resultat-vaccin',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'resultat-vaccin'
        },
        children: [
          { path:'', component: ResultatVaccinComponent }
        ]
      },
      {
        path: 'mes-resultat',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'mes-resultat'
        },
        children: [
          { path:'', component: MesResultatsComponent }
        ]
      },
      {
        path: 'valider-test',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'valider-test'
        },
        children: [
          { path:'', component: ValidationTestComponent }
        ]
      },
      {
        path: 'preleveur',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'preleveur'
        },
        children: [
          { path:'', component: PreleveurComponent }
        ]
      },
      {
        path: 'controleur',
        canActivateChild: [LinkGuardService],
        data: {
          url: 'controleur'
        },
        children: [
          { path:'', component: ControleurComponent }
        ]
      },
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
