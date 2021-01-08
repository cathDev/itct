import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';

declare function tools(): any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  appointments : any = [];
  labo : any = [];

  form: FormGroup;
  url: string = "/client/appointment";
  userConnected : any = {};
  patient : any = {};

  constructor(
              private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private authenticationService: AuthenticationService,
              private spinner: NgxSpinnerService,
              private toast: ToastrService,
              ) { }

  ngOnInit() {
    tools();
    this.userConnected = this.authenticationService.getUserInLocalStorage();
    this.patient = this.userConnected.patient;

    this.allAppointment();
    this.allLabo();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      jour: ['', Validators.required],
      laboratoire: ['', Validators.required],
      objetAppointment: ['', Validators.required],
      patient: ['', Validators.required],
      paysArrivee: ['', Validators.required],
      paysDepart: ['', Validators.required],
      villeArrivee: ['', Validators.required],
      villeDepart: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      aeroportDepart: ['', Validators.required],
      aeroportArrive: ['', Validators.required],
    });
  }

  public resetForm(){

  }

  public allAppointment(){
    this.resourceService.getResources(this.url+"/all")
      .subscribe(res => {
          this.appointments = res;
          console.log(this.appointments);
        },
        error => {
          console.log(error);
        });
  }

  public allLabo(){
    this.resourceService.getResources("/laboratoire/all")
      .subscribe(res => {
          this.labo = res;
          console.log(this.labo);
        },
        error => {
          console.log(error);
        });
  }

  public saveAppointment(){
    this.spinner.show();
    var resultat;
    console.log(this.form.value);
     var appointment = {
      jour: this.form.get("jour").value,
      laboratoire: {
        id: this.form.get("laboratoire").value
      },
      objetAppointment: this.form.get("objetAppointment").value,
      patient: {
        id: this.patient.id
      },
      paysArrivee: this.form.get("paysArrivee").value,
      paysDepart: this.form.get("paysDepart").value,
      villeArrivee: this.form.get("villeArrivee").value,
      villeDepart: this.form.get("villeDepart").value,
       aeroportDepart: this.form.get("aeroportDepart").value,
       aeroportArrive: this.form.get("aeroportArrive").value
    };
    console.log(appointment);
    this.resourceService.saveResource(this.url+"/save", appointment)
      .subscribe(res => {
          this.spinner.hide();
          resultat = res;
          this.toast.success("Opération effectuée avec succès");
          console.log(resultat);
        },
        error => {
          this.spinner.hide();
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

}
