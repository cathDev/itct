import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './util-component/sidebar/sidebar.component';
import { HeaderComponent } from './util-component/header/header.component';
import { FooterComponent } from './util-component/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {LayoutComponent} from './layout.component';
import {LayoutRoutingModule} from './layout-routing.module';
import { DoctorComponent } from './doctor/doctor.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { PatientsComponent } from './patients/patients.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LaboratoireComponent } from './laboratoire/laboratoire.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import { ResultatTestComponent } from './resultat-test/resultat-test.component';
import { ValidationVaccinComponent } from './validation-vaccin/validation-vaccin.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    DashboardComponent,
    DoctorComponent,
    AppointmentsComponent,
    PatientsComponent,
    LaboratoireComponent,
    ResultatTestComponent,
    ValidationVaccinComponent,
    TestComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class LayoutModule { }