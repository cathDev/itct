import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';

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
  userConnected : any = {};
  labo : any = {};

  form: FormGroup;

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private sanitizer:DomSanitizer) { }

  ngOnInit() {
    tools();
    this.allPatient();
    this.allTest();
    this.initForm();
    this. userConnected = this.authenticationService.getUserInLocalStorage();
    this.labo = this.userConnected.laboratoire;
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

  saveTest(){
    this.spinner.show();
    console.log(this.form.value);
    var test = {
      laboratoire: {
        id:this.labo.id
      },
      commentaire: this.form.get("testCommentaire").value,
      patient: {
        id: this.patient.id
      },
      testIGG: this.form.get("igg").value,
      testIGM: this.form.get("igm").value
    };

    this.resourceService.saveResource("/client/test/save", test)
      .subscribe(res => {
          this.spinner.hide();
          this.form.reset();
          this.toastr.success("Opération effectuée avec succès.");
        },
        error => {
          this.spinner.hide();
          this.toastr.success("Une erreur est survenue, reéssayez plus tard.");
          console.log(error);
        });
  }

}
