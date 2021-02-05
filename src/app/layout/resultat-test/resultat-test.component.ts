import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {UtilsService} from '../../shared/services/utils/utils.service';

declare function tools(): any;

@Component({
  selector: 'app-resultat-test',
  templateUrl: './resultat-test.component.html',
  styleUrls: ['./resultat-test.component.css']
})
export class ResultatTestComponent implements OnInit {

  url: string = "/client/patient";
  patients : any = [];
  tests : any = [];
  rdv : any = [];
  search: string = "";
  birthday: string = "";
  imagePath: any;
  imagePassport: any;
  userConnected : any = {};
  labo : any = {};

  form: FormGroup;
  patient : any = {};
  appointment : any = {};
  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private authenticationService: AuthenticationService,
              private utilsService: UtilsService,
              private spinner: NgxSpinnerService,
              private toast: ToastrService,
              private sanitizer:DomSanitizer) { }

  ngOnInit() {
    tools();
    this.userConnected = this.authenticationService.getUserInLocalStorage();
    this.labo = this.userConnected.user;

    this.patient = this.utilsService.getPatient();
    this.appointment = this.utilsService.getAppointment();
    /*this.patient = this.utilsService.getPatient();*/
    this.allPatient();
    /*this.allTest();*/
    this.allRDV();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      igg: ['', Validators.required],
      igm: ['', Validators.required],
      testCommentaire: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  public searchPatient(){
    var image;
    var imagePassport;
    var result;
    this.resourceService.getResourcesById(this.url+"/search", this.search)
      .subscribe(res => {
          result = res;
          this.patient = res;
          console.log(this.patient);
          /*this.birthday = this.millisToDate(this.patient.birthday);
          image = 'data:image/png;base64,'+this.patient.imageSelfie;
          this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
          imagePassport = 'data:image/png;base64,'+this.patient.imagePassport;
          this.imagePassport = this.sanitizer.bypassSecurityTrustResourceUrl(imagePassport);
          console.log(this.patient);*/
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

  saveTest(){
    this.spinner.show();
    console.log(this.form.value);
    var test = {
      "commentaire": this.form.get("testCommentaire").value,
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
      "testIGG": this.form.get("igg").value,
      "testIGM": this.form.get("igm").value,
      "vaccin": this.appointment.vaccin,
      "villeArrivee": this.appointment.villeArrivee,
      "villeDepart": this.appointment.villeDepart
    };

    this.resourceService.saveResource("/client/appointment/update/"+this.appointment.id, test)
      .subscribe(res => {
        console.log(res);
        console.log("le test est bien enregistrer");
          this.spinner.hide();
          this.form.reset();
          this.patient = {};
          this.toast.success("Opération effectuée avec succès.");
        },
        error => {
          console.log("le test n'est pas bien enregistrer");
          this.spinner.hide();
          this.toast.error("Une erreur est survenue, reéssayez plus tard.");
          console.log(error);
        });
  }

}
