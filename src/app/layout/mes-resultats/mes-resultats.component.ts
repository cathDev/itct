import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';

@Component({
  selector: 'app-mes-resultats',
  templateUrl: './mes-resultats.component.html',
  styleUrls: ['./mes-resultats.component.css']
})
export class MesResultatsComponent implements OnInit {

  userConnected : any = {};
  patient : any = {};
  tests: any = [];
  vaccins: any = [];
  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this. userConnected = this.authenticationService.getUserInLocalStorage();
    this.patient = this.userConnected.patient;
    this.allTest();
    this.allVaccin();
  }

  public allTest(){
    this.resourceService.getResourcesById("/client/test/patient", this.patient.id)
      .subscribe(res => {
          this.tests = res;
          console.log(this.tests);
        },
        error => {
          console.log(error);
        });
  }

  public allVaccin(){
    this.resourceService.getResourcesById("/client/vaccinate/patient", this.patient.id)
      .subscribe(res => {
          this.vaccins = res;
          console.log(this.vaccins);
        },
        error => {
          console.log(error);
        });
  }

  public millisToDate(millis){
    console.log(new Date(millis));
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const dateObj = new Date(millis);
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = day + '-'+month+'-'+year;
    console.log(output);
    return output;
  }

}
