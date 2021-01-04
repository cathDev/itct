import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  patient: any = {};
  public defaultLang : string = 'en';

  constructor() { }

  public getPatient(){
    return this.patient;
  }

  public setPatient(obj){
    this.patient = obj;
  }

  public getLang(){
    return this.defaultLang;
  }

  public setLang(lang){
    this.defaultLang = lang;
  }
}
