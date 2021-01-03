import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  url: string = "/client/appointment";
  appointments : any = [];
  search: string = "";
  image : any;

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private router : Router,
              private authenticationService : AuthenticationService,
              private sanitizer:DomSanitizer) { }


  ngOnInit() {
    this.allAppointments();
  }

  public allAppointments(){
    this.resourceService.getResources(this.url+"/all")
      .subscribe(res => {
          this.appointments = res;
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
    this.authenticationService.setPatient(obj.patient);
    this.router.navigateByUrl("/resultat-test");
    /*if(obj.objetAppointment == ""){
      this.router.navigateByUrl("/resultat-test");
    }
    else if(obj.objetAppointment == ""){
      this.router.navigateByUrl("/resultat-vaccin");
    }*/

    console.log("j'ai cliqué sur un rendez vous");
    console.log(this.authenticationService.getPatient());
  }

}
