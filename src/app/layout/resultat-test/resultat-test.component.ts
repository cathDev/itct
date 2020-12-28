import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {DomSanitizer} from '@angular/platform-browser';

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
  birthday: string = "";
  imagePath: any;

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private sanitizer:DomSanitizer) { }

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
    var image;
    this.resourceService.getResources(this.url+"/all")
      .subscribe(res => {
          this.patients = res;
          this.patient = this.patients[3];
          this.birthday = this.millisToDate(this.patient.birthday);
          image = 'data:image/png;base64,'+this.patient.imageId;
          this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
          console.log(this.patients);
          console.log(this.patient);
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
