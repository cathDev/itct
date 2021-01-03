import {Util} from './util';

export class Utils {
  patient: any = {};

  getPatient(){
    return this.patient;
  }

  setPatient(obj){
    this.patient = obj;
  }

}
