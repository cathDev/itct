import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {DomSanitizer} from '@angular/platform-browser';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {UtilsService} from '../../shared/services/utils/utils.service';

declare function tools(): any;

@Component({
  selector: 'app-resultat-vaccin',
  templateUrl: './resultat-vaccin.component.html',
  styleUrls: ['./resultat-vaccin.component.css']
})
export class ResultatVaccinComponent implements OnInit {

  url: string = "/client/patient";
  patient : any = {};
  appointment : any = {};
  patients : any = [];
  tests : any = [];
  rdv : any = [];
  vaccins : any = [];
  search: string = "";
  birthday: string = "";
  imagePath: any;
  userConnected : any = {};
  labo : any = {};
  commentaire : string = "";

  vaccinEffectuer: any = [];
  dropdownSettings = {};

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private authenticationService: AuthenticationService,
              private utilsService: UtilsService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private sanitizer:DomSanitizer) { }

  ngOnInit() {
    tools();
    var image;
    this.userConnected = this.authenticationService.getUserInLocalStorage();
    this.labo = this.userConnected.laboratoire;

    this.patient = this.utilsService.getPatient();
    this.appointment = this.utilsService.getAppointment();
    /*this.birthday = this.millisToDate(this.patient.birthday);
    image = 'data:image/png;base64,'+this.patient.imageSelfie;
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    console.log(this.patient);*/

    this.allPatient();
   /* this.allTest();*/
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nomVaccin',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.allRDV();
    this.allVaccin();
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
    var image;
    this.resourceService.getResources(this.url+"/all")
      .subscribe(res => {
          this.patients = res;
          console.log(this.patients);
        },
        error => {
          console.log(error);
        });
  }

  /*public allTest(){
    this.resourceService.getResources("/client/test/all")
      .subscribe(res => {
          this.tests = res;
          console.log(this.tests);
        },
        error => {
          console.log(error);
        });
  }*/

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

  public allVaccin(){
    this.resourceService.getResources("/vaccin/all")
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

  saveVaccin(){
    this.spinner.show();
    var test = {
      "commentaire": this.appointment.commentaire,
      "jour": this.appointment.jour,
      "laboratoire": {
        "id": this.appointment.laboratoire.id,
      },
      "objetAppointment": {
        "id": this.appointment.objetAppointment.id,
        "label": this.appointment.objetAppointment.label
      },
      "patient": {
        "id": this.appointment.patient.id
      },
      "paysArrivee": this.appointment.paysArrivee,
      "paysDepart": this.appointment.paysDepart,
      "plageHoraire": this.appointment.plageHoraire,
      "testIGG": this.appointment.testIGG,
      "testIGM": this.appointment.testIGM,
      "vaccin": this.vaccinEffectuer,
      "villeArrivee": this.appointment.villeArrivee,
      "villeDepart": this.appointment.villeDepart
    };

    this.resourceService.saveResource("/client/appointment/update/"+this.appointment.id, test)
      .subscribe(res => {
          this.spinner.hide();
          this.vaccinEffectuer = [];
          this.toastr.success("Opération effectuée avec succès.");
          console.log("opération reussi");
        },
        error => {
          this.spinner.hide();
          this.toastr.error("Une erreur est survenue, reéssayez plus tard.");
          console.log(error);
        });
  }

}
