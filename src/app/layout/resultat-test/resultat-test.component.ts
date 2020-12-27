import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';

declare function tools(): any;

@Component({
  selector: 'app-resultat-test',
  templateUrl: './resultat-test.component.html',
  styleUrls: ['./resultat-test.component.css']
})
export class ResultatTestComponent implements OnInit {

  url: string = "/client/patient";
  patient : any = {};
  patients : any = [];
  tests : any = [];
  search: string = "";

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,) { }

  ngOnInit() {
    tools();
    this.allPatient();
    this.allTest();
  }

  public searchPatient(id){
    this.resourceService.getResources(this.url)
      .subscribe(res => {
          this.patient = res;
          console.log(this.patient);
        },
        error => {
          console.log(error);
        });
  }

  public allPatient(){
    this.resourceService.getResources(this.url+"/all")
      .subscribe(res => {
          this.patients = res;
          console.log(this.patients);
        },
        error => {
          console.log(error);
        });
  }

  public allTest(){
    this.resourceService.getResources("/client/test/all")
      .subscribe(res => {
          this.tests = res;
          console.log(this.tests);
        },
        error => {
          console.log(error);
        });
  }

}
