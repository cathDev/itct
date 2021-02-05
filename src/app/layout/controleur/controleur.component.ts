import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmationDialogService} from '../../shared/services/confirmationDialog/confirmation-dialog.service';

declare var jQuery:any;

@Component({
  selector: 'app-controleur',
  templateUrl: './controleur.component.html',
  styleUrls: ['./controleur.component.css']
})
export class ControleurComponent implements OnInit {

  url: string = "";
  laboratoires : any = [];
  controleurs : any = [];
  imagePath: any;
  urlFile: any = null;
  form : FormGroup;
  objUpdateImage: any;


  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private sanitizer:DomSanitizer,
              private confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngOnInit() {
    this.getAllLabo();
    this.getAllControleur();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      id : [''],
      birthday: ['', Validators.required],
      email: ['', Validators.required],
      imageSelfie: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      sexe: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      typeControleur: ['', Validators.required],
    });
  }

  resetForm(){
    this.form.reset();
  }

  save(){
    this.spinner.hide();
    console.log(this.form.value);
    var result
    var imageId = new String("");
    if(this.urlFile != null) imageId = this.urlFile.split(",")[1];

    var controleur = {
      birthday: this.form.get("birthday").value,
      email: this.form.get("email").value,
      imageSelfie: imageId,
      name: this.form.get("name").value,
      phone: this.form.get("phone").value,
      sexe: this.form.get("sexe").value,
      password: this.form.get("password").value,
      username: this.form.get("username").value,
      typeControleur: this.form.get("typeControleur").value,
      role: "CONTROLEUR",
    };
    console.log("nombre de caractère de l'image "+imageId.length);
    this.resourceService.resourceForLogin("/client/auth/register", controleur)
      .subscribe(res => {
          result = res;
          this.spinner.hide();
          if(result.error_message == "Username Already Used"){
            this.toastr.error("Ce nom d'utilisateur existe déjà.");
          }
          else {
            this.getAllControleur();
            this.form.reset();
            this.toastr.success("Votre compte a été enregistré avec succès.");
          }

        },
        error => {
          this.spinner.hide();
          this.toastr.error("Une erreur est survenue, réessayez plus tard.");
          console.log(error);
        });
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

  onFileChanged(event) {
    const files = event.target.files;
    console.log(files);
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      /*this.message = "Only images are supported.";*/
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.urlFile = reader.result;
    }
  }

  getAllControleur(){
    this.resourceService.getResourcesWithoutSecurity("/admin/controleur/all")
      .subscribe(res => {
          this.controleurs = res;
          console.log(this.controleurs);
        },
        error => {
          console.log(error);
        });
  }

  delete(event, obj){
    event.preventDefault();
    console.log(obj);
    this.resourceService.saveResource('/admin/controleur/delete/'+obj.id, null)
      .subscribe(data => {
        this.toastr.success("Suppression réussie.");
        this.getAllControleur();
      }, error => {

      });
  }

  public openConfirmationDialog(event: MouseEvent,obj) {
    event.preventDefault();
    this.confirmationDialogService.confirm('Confirmer la suppression', 'Voulez-vous supprimer cette ligne ?', 'Oui', 'Non')
      .then((confirmed) => {
        if (confirmed) {
          this.delete(event,obj)
        }

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  update(){
    console.log(this.form.value);

    this.spinner.hide();
    var result;
    var imageId = new String("");
    if(this.urlFile != null){
      imageId = this.urlFile.split(",")[1];
      console.log("c'est différent de null");
    }
    else{
      imageId = this.form.get("imageSelfie").value;
    }

    var controleur = {
      birthday: this.form.get("birthday").value,
      email: this.form.get("email").value,
      imageSelfie: imageId,
      name: this.form.get("name").value,
      phone: this.form.get("phone").value,
      sexe: this.form.get("sexe").value,
      password: this.form.get("password").value,
      username: this.form.get("username").value,
      typeControleur: this.form.get("typeControleur").value,
      role: "CONTROLEUR",
    };

    console.log(controleur);

    this.resourceService.saveResource("/admin/controleur/update/"+this.form.get("id").value, controleur)
      .subscribe(res => {
          result =res;
          this.spinner.hide();
          if(result.error_message == "Username Already Used"){
            this.toastr.warning("Ce nom d’utilisateur existe déjà.");
          }
          else {
            this.getAllControleur();
            this.toastr.success("Mise à jour du contrôleur réussie.");
            this.form.reset();
            jQuery("#myModal").modal("hide");
            this.urlFile = null;
            this.imagePath = null;
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error("Une erreur est survenue, réessayez plus tard.");
          console.log(error);
        });
  }

  public millisToDate(millis){
    var Nmonth = new String();
    const dateObj = new Date(millis);
    const month = (dateObj.getMonth())+1;
    Nmonth = ""+month;
    if(Nmonth.length == 1) Nmonth = "0"+month;
    console.log(month);
    console.log(Nmonth);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = year+ '-'+Nmonth+'-'+day;
    return output;
  }

  edit(event, obj : any){
    event.preventDefault();
    var image;
    image = 'data:image/png;base64,'+obj.imageSelfie;
    this.objUpdateImage = obj.imageSelfie;
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    this.urlFile = null;

    this.form.patchValue(
      {
        id : obj.id,
        birthday: this.millisToDate(obj.birthday),
        email: obj.email,
        imageSelfie: obj.imageSelfie,
        name: obj.name,
        phone: obj.phone,
        sexe: obj.sexe,
        password: "",
        username: obj.user.username,
        typeControleur: obj.typeControleur,
      }
    );

    console.log(obj);
  }

}
