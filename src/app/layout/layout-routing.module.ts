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

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'appointments', component: AppointmentsComponent},
      {path: 'doctors', component: DoctorComponent},
      {path: 'patients', component: PatientsComponent},
      {path: 'laboratoires', component: LaboratoireComponent},
      {path: 'resultat-test', component: ResultatTestComponent},
      {path: 'prendre-rendez-vous', component: TestComponent},
      {path: 'resultat-vaccin', component: ResultatVaccinComponent},
      {path: 'mes-resultat', component: MesResultatsComponent},
      {path: 'valider-test', component: ValidationTestComponent},
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
