import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  patient: any = {};
  appointment: any = {};

  constructor() { }

  public getPatient(){
    return this.patient;
  }

  public setPatient(obj){
    this.patient = obj;
  }
  public getAppointment(){
    return this.appointment;
  }

  public setAppointment(obj){
    this.appointment = obj;
  }

}
