import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import {Router} from '@angular/router';

/*declare function charts();*/

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

  laboChartTab = [];
  controleurChartTab = [];
  preleveurChartTab = [];

  year = new Date().getFullYear();

  constructor(
              private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              private authenticationService : AuthenticationService,
              private router : Router
              ) { }

  ngOnInit() {
    /*charts();*/
    if(this.role == "PATIENT"){
      this.router.navigateByUrl("/mes-resultat");
    }
    if(this.role == "PRELEVEUR" || this.role == "LABORANTIN"){
      this.router.navigateByUrl("/appointments");
    }

    /*this.getAllLabo();
    this.getAllPreleveur();
    this.getAllControleur();*/

    if(this.role == "ADMIN"){
      this.getAllLabo();
      this.getAllPreleveur();
      this.getAllControleur();
      console.log("render chart");

    }

  }

  getAllLabo(){
    this.resourceService.getResourcesWithoutSecurity("/laboratoire/all")
      .subscribe(res => {
          this.laboratoires = res;
          console.log(this.laboratoires);
          this.laboChartTab = this.objetOfChart(this.laboratoires );
          this.laboChart();
        },
        error => {
          console.log(error);
        });
  }

  laboChart(){
    let chart = new CanvasJS.Chart("Labochart", {
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      panEnabled: true,
      creditText : "",
      creditHref : "",
      title: {
        text: "Nombre de laboratoire par mois en "+this.year,
        fontSize: 20,
        horizontalAlign : "left",
        margin : 20,
        fontColor : "#666666"
      },
      data: [{
        labelFontColor: '#9EA4AC',
        labelFontFamily: 'Lato, sans-serif',
        labelFontWeight: 'normal',
        indexLabelLineColor: 'white',
        type: "column",
        dataPoints: this.laboChartTab
      }]
    });



    chart.render();
  }

  getAllControleur(){
    this.resourceService.getResourcesWithoutSecurity("/admin/controleur/all")
      .subscribe(res => {
          this.controleurs = res;
          console.log(this.controleurs);
          this.controleurChartTab = this.objetOfChart(this.controleurs);
          this.controleurChart();
        },
        error => {
          console.log(error);
        });
  }

  controleurChart(){
    CanvasJS.addColorSet("controleurColor",
      [//colorSet Array
        "#96AB5C",
        "#2F4F4F",
        "#96AB5C",
        "#008080",
        "#2E8B57",
        "#3CB371"
      ]);

    let chart = new CanvasJS.Chart("Controleurchart", {
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      panEnabled: true,
      colorSet: "controleurColor",
      title: {
        text: "Nombre de contrôleur par mois en "+this.year,
        fontSize: 20,
        horizontalAlign : "left",
        margin : 20,
        fontColor : "#666666"
      },
      data: [{
        labelFontColor: '#9EA4AC',
        labelFontFamily: 'Lato, sans-serif',
        labelFontWeight: 'normal',
        indexLabelLineColor: 'white',
        type: "splineArea",
        dataPoints: this.controleurChartTab
      }]
    });

    chart.render();
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
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = year+ '-'+Nmonth+'-'+day;
    return output;
  }

  public objetOfChart(tab){
    var thisYear = (new Date()).getFullYear();
    var monthOfYear = [1,2,3,4,5,6,7,8,9,10,11,12];
    var itemOfThisyear = [];
    var finalTAb = [];
    tab.forEach(item => {
      if((new Date(item.createdDate)).getFullYear() == thisYear){
        itemOfThisyear.push(item);
      }
    });

    monthOfYear.forEach(mont => {
      finalTAb.push(this.itemOfMonth(itemOfThisyear, mont));
    });

    console.log(finalTAb);

    return finalTAb;

  }

  itemOfMonth(tab, month){

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    var number = 0;
    tab.forEach(item => {
      var mth = ((new Date(item.createdDate)).getMonth())+1;

      if(mth == month) {
        number = number+1;
      }
    });

    var obj = {
      y : number,
      label : monthNames[month-1]
    };
    return obj;
  }

}
