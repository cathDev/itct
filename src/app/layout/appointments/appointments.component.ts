import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  url: string = "/client/appointment";
  appointments : any = [];
  search: string = "";

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,) { }


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


}
