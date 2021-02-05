import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import {Router} from '@angular/router';

declare function charts();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  laboratoires : any = [];
  controleurs : any = [];
  preleveurs : any = [];
  user = this.authenticationService.getUserInLocalStorage();
  role = this.user.role;
  constructor(
              private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              private authenticationService : AuthenticationService,
              private router : Router
              ) { }

  ngOnInit() {
    charts();
    if(this.role == "PATIENT"){
      this.router.navigateByUrl("/mes-resultat");
    }
    if(this.role == "PRELEVEUR" || this.role == "LABORANTIN"){
      this.router.navigateByUrl("/appointments");
    }
    this.getAllLabo();
    this.getAllPreleveur();
    this.getAllControleur();

    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Basic Column Chart in Angular"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "Jan" },
          { y: 55, label: "Fev" },
          { y: 50, label: "Mars" },
          { y: 65, label: "Avr" },
          { y: 95, label: "Mai" },
          { y: 68, label: "Juin" },
          { y: 28, label: "Juill" },
          { y: 34, label: "Août" },
          { y: 14, label: "Sep" },
          { y: 14, label: "Oct" },
          { y: 14, label: "Nov" },
          { y: 14, label: "Dec" }
        ]
      }]
    });

   /* chart.render();*/
  }

  getAllLabo(){
    this.resourceService.getResourcesWithoutSecurity("/laboratoire/all")
      .subscribe(res => {
          this.laboratoires = res;
          console.log(this.laboratoires);
        },
        error => {
          console.log(error);
        });
  }

  getAllControleur(){
    this.resourceService.getResourcesWithoutSecurity("/admin/controleur/all")
      .subscribe(res => {
          this.controleurs = res;
          console.log(this.controleurs);
        },
        error => {
          console.log(error);
        });
  }

  getAllPreleveur(){
    this.resourceService.getResources("/admin/preleveur/all")
      .subscribe(res => {
          this.preleveurs = res;
          console.log(this.preleveurs);
        },
        error => {
          console.log(error);
        });
  }

  public millisToDate(millis){
    var Nmonth = new String();
    const dateObj = new Date(millis);
    const month = (dateObj.getMonth())+1;
    Nmonth = ""+month;
    if(Nmonth.length == 1) Nmonth = "0"+month;
    console.log(month);
    console.log(Nmonth);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = year+ '-'+Nmonth+'-'+day;
    return output;
  }

}
