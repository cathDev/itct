import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from '../../shared/services/authentication/authentication.service';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import {ConfirmationDialogService} from '../../shared/services/confirmationDialog/confirmation-dialog.service';

declare function tools(): any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  appointments : any = [];
  objetAppointments : any = [];
  labo : any = [];
  country : any = [];
  cities : any = [];

  form: FormGroup;
  url: string = "/client/appointment";
  userConnected : any = {};
  patient : any = {};

  p: number = 1;
  items: number = 8;

  //variable for translation
  deleteTitle : string = "Cancel the appointment";
  prevoius : string = "Previous";
  next : string = "Next";

  constructor(
              private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private authenticationService: AuthenticationService,
              private spinner: NgxSpinnerService,
              private confirmationDialogService: ConfirmationDialogService,
              private toast: ToastrService
              ) { }

  ngOnInit() {
    tools();
    this.userConnected = this.authenticationService.getUserInLocalStorage();
    this.patient = this.userConnected.user;
    console.log(this.patient);
    /*this.allLabo();*/
    this.allCountry();
    this.objectAppointment();
    this.initForm();

    this.allAppointment();
  }

  initForm() {
    this.form = this.formBuilder.group({
      jour: ['', Validators.required],
      plageHoraire: ['', Validators.required],
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

  public allAppointment(){
    console.log(this.patient.id);
    this.resourceService.getResources(this.url+"/patient/"+this.patient.id)
      .subscribe(res => {
          this.appointments = res;
          console.log(this.appointments);
        },
        error => {
          console.log(error);
        });
  }

  public allLabo(){
    this.resourceService.getResources("/laboratoire/city/"+this.form.get('ville').value)
      .subscribe(res => {
          this.labo = res;
          console.log(this.labo);
        },
        error => {
          console.log(error);
        });
  }

  public allCountry(){
    this.resourceService.getResources("/client/country/all")
      .subscribe(res => {
          this.country = res;
          console.log(this.country);
        },
        error => {
          console.log(error);
        });
  }

  public allCitiesByCountry(){
    this.resourceService.getResources("/client/country/"+this.form.get("pays").value+"/city")
      .subscribe(res => {
          this.cities = res;
          console.log(this.cities);
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
       plageHoraire: this.form.get("plageHoraire").value,
      laboratoire: {
        id: this.form.get("laboratoire").value
      },
      objetAppointment: {
        id: this.form.get("objetAppointment").value
      },
      paysArrivee: this.form.get("paysArrivee").value,
      paysDepart: this.form.get("paysDepart").value,
      villeArrivee: this.form.get("villeArrivee").value,
      villeDepart: this.form.get("villeDepart").value
    };
    console.log(appointment);
    this.resourceService.saveResource(this.url+"/save", appointment)
      .subscribe(res => {
          this.spinner.hide();
          this.form.reset();
          resultat = res;
          this.allAppointment();
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

  public objectAppointment(){
    this.resourceService.getResources("/client/objetAppointment/all")
      .subscribe(res => {
          this.objetAppointments = res;
          console.log(this.objetAppointments);
        },
        error => {
          console.log(error);
        });
  }

  cancelAppointment(event, obj){
    event.preventDefault();
    console.log(obj);
    /*this.resourceService.saveResource('/laboratoire/delete/'+obj.id, null)
      .subscribe(data => {
        this.toast.success("Annulation réussie.");
        this.allAppointment();
      }, error => {

      });*/
  }

  public openConfirmationDialog(event: MouseEvent,obj) {
    event.preventDefault();
    this.confirmationDialogService.confirm('Confirmer l\'annulation du RDV', 'Voulez-vous annuler ce RDV ?', 'Oui', 'Non')
      .then((confirmed) => {
        if (confirmed) {
          this.cancelAppointment(event,obj)
        }

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
