import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import * as CanvasJS from '../../../assets/js/canvasjs.min';

declare function charts();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  laboratoires : any = [];

  constructor(
              private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              ) { }

  ngOnInit() {
    charts();
    this.getAllLabo();

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

    chart.render();
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

}
