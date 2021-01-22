import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import {UtilsService} from '../../shared/services/utils/utils.service';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  url: string = "/client/appointment";
  appointments : any = [];
  filterAppointments : any = [];
  appointmentsAll : any = [];
  search: string = "";
  image : any;
  user : any;
  userRole : any;
  idLabo: number;

  p: number = 1;
  items: number = 8;

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private router : Router,
              private utilsService : UtilsService,
              private authenticationService : AuthenticationService,
              private sanitizer:DomSanitizer) { }


  ngOnInit() {
    this.user = this.authenticationService.getUserInLocalStorage();
    this.userRole = this.user.role;
    console.log(this.userRole);
    if(this.userRole == "LABORANTIN"){
      this.idLabo = this.user.user.id;
      console.log(this.userRole);
      console.log("je suis connecté en tant que labo");
    }
    else if(this.userRole == "PRELEVEUR"){
      this.idLabo = this.user.user.laboratoire.id;
      console.log(this.userRole);
      console.log("je suis connecté en tant que preleveur");
    }


    this.allAppointments();
  }

  public allAppointments(){
    var result;
    var testPreleve = [];
    var testNonPreleve = [];
    this.resourceService.getResources(this.url+"/labo/"+this.idLabo)
      .subscribe(res => {
          result = res;
          result.forEach(appointment => {
            if(appointment.objetAppointment.label.toLowerCase() == "test covid" && appointment.retrieved == false){
              testNonPreleve.push(appointment);
            }
            else {
              testPreleve.push(appointment);
            }
          });
          if(this.userRole.toLowerCase() == "preleveur"){
            this.appointments = testNonPreleve;
          }
          else {
            this.appointments = testPreleve;
          }

          this.appointmentsAll = this.appointments;
          console.log(this.appointments);
        },
        error => {
          console.log(error);
        });
  }

  public millisToDate(millis){
    const dateObj = new Date(millis);
    const month = dateObj.getMonth()+1;
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = day + '-'+month+'-'+year;
    return output;
  }

  public patientImage(img){
    var image;
    this.image = img;
    image = 'data:image/png;base64,'+img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(image);
  }

  public validateTestOrVaccin(obj, event){
    event.preventDefault();
    var motif : any = obj.objetAppointment;
    this.utilsService.setPatient(obj.patient);
    this.utilsService.setAppointment(obj);
    /*this.router.navigateByUrl("/resultat-test");*/
    if((motif.label).toLowerCase() == "test covid"){
      if(obj.retrieved == false){
        this.router.navigateByUrl("/valider-test");
      }
      else{
        this.router.navigateByUrl("/resultat-test");
      }
    }
    else if((motif.label).toLowerCase() == "vaccin"){
      this.router.navigateByUrl("/resultat-vaccin");
    }

    console.log("j'ai cliqué sur un rendez vous");
    console.log(this.utilsService.getPatient());
    console.log("j'ai cliqué sur un rendez vous");
    console.log(this.utilsService.getAppointment());
  }

  public searchAppointment(){
    if(this.appointments.length == 0){
      this.appointments = this.appointmentsAll;
    }
    console.log("Hello");
    console.log(this.search);
    var filterTabs = [];
    this.appointments.filter(elt => {
      if(elt["jour"] == (this.dateToInt(this.search))){
        filterTabs.push(elt);
      }
    });
    this.appointments = filterTabs;

    console.log(this.appointments);
  }

  public dateToInt(date){
    return new Date(date).getTime();
  }

  public refreshPage(){
    this.appointments = this.appointmentsAll;
    this.search = "";
  }

}
