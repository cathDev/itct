import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import {UtilsService} from '../../shared/services/utils/utils.service';

declare function tools(): any;

@Component({
  selector: 'app-validation-test',
  templateUrl: './validation-test.component.html',
  styleUrls: ['./validation-test.component.css']
})
export class ValidationTestComponent implements OnInit {

  url: string = "/client/patient";
  patient : any = {};
  appointment : any = {};
  patients : any = [];
  tests : any = [];
  rdv : any = [];
  search: string = "";
  soins: boolean = false;
  birthday: string = "";
  imagePath: any;
  userConnected : any = {};
  labo : any = {};

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private authenticationService: AuthenticationService,
              private utilsService: UtilsService,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private sanitizer:DomSanitizer) { }

  ngOnInit() {
    tools();
    this. userConnected = this.authenticationService.getUserInLocalStorage();
    this.labo = this.userConnected.laboratoire;

    this.patient = this.utilsService.getPatient();
    this.birthday = this.millisToDate(this.patient.birthday);
    var image;
    image = 'data:image/png;base64,'+this.patient.imageSelfie;
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    this.appointment = this.utilsService.getAppointment();
    this.allPatient();
   /* this.allTest();*/
    /*this.allRDV();*/
  }

  public searchPatient(){
    var image;
    var result;
    this.resourceService.getResourcesById(this.url+"/search", this.search)
      .subscribe(res => {
          result = res;
          this.patient = res;
          this.birthday = this.millisToDate(this.patient.birthday);
          image = 'data:image/png;base64,'+this.patient.imageSelfie;
          this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
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

  public allRDV(){
    this.resourceService.getResourcesById("/client/appointment/labo",this.labo.id)
      .subscribe(res => {
          this.rdv = res;
          console.log(this.rdv);
        },
        error => {
          console.log(error);
        });
  }

  public millisToDate(millis){
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const dateObj = new Date(millis);
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = day + '-'+month+'-'+year;
    return output;
  }

  saveTest(){
    this.spinner.show();
    var result;
    this.resourceService.saveResource("/client/appointment/preleveur/update/"+this.appointment.id, null)
      .subscribe(res => {
          this.spinner.hide();
          console.log(res);
          result = res;
          console.log("le test est bien enregistrer");
          this.patient = {};
          this.soins = false;
          this.toast.success(result.message + ".");
        },
        error => {
          console.log("le test n'est pas bien enregistrer");
          this.spinner.hide();
          this.toast.error("Une erreur est survenue, reéssayez plus tard.");
          console.log(error);
        });
  }

}
