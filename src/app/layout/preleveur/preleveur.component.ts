import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmationDialogService} from '../../shared/services/confirmationDialog/confirmation-dialog.service';

declare var jQuery:any;

@Component({
  selector: 'app-preleveur',
  templateUrl: './preleveur.component.html',
  styleUrls: ['./preleveur.component.css']
})
export class PreleveurComponent implements OnInit {
  url: string = "";
  laboratoires : any = [];
  imagePath: any;
  urlFile: any;
  objUpdateImage: any;
  preleveurs: any = [];
  form : FormGroup;


  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private sanitizer:DomSanitizer,
              private confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngOnInit() {
    this.getAllLabo();
    this.getAllPreleveur();
    this.initForm();

  }

  initForm() {
    this.form = this.formBuilder.group({
      id: '',
      birthday: ['', Validators.required],
      email: ['', Validators.required],
      imageSelfie: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      sexe: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      laboratoire: ['', Validators.required],
    });
  }

  save(){
    this.spinner.hide();
    var result;
    console.log(this.form.value);
    var imageId = new String("");
    if(this.urlFile != null) imageId = this.urlFile.split(",")[1];

    var preleveur = {
      birthday: this.form.get("birthday").value,
      email: this.form.get("email").value,
      imageSelfie: imageId,
      name: this.form.get("name").value,
      phone: this.form.get("phone").value,
      sexe: this.form.get("sexe").value,
      password: this.form.get("password").value,
      username: this.form.get("username").value,
      ville: "",
      laboratoire:{
        id:this.form.get("laboratoire").value
      },
      role: "PRELEVEUR",
    };

    console.log("nombre de caractère de l'image "+imageId.length);
    this.resourceService.resourceForLogin("/client/auth/register", preleveur)
      .subscribe(res => {
          result =res;
          this.spinner.hide();
          if(result.error_message == "Username Already Used"){
            this.toastr.error("Ce nom d’utilisateur existe déjà.");
          }
          else {
            this.getAllPreleveur();
            this.toastr.success("Enregistrement du préleveur réussi.");
            this.form.reset();
            this.urlFile = null;
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

  getAllPreleveur(){
    this.resourceService.getResources("/admin/preleveur/all")
      .subscribe(res => {
          this.preleveurs = res;
          console.log(this.preleveurs);
        },
        error => {
          console.log(error);
        });
  }

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      /*this.message = "Only images are supported.";*/
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    console.log(files[0]);
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.urlFile = reader.result;
    }

  }

  public resetForm(){
    this.form.reset();
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

  isObjet(obj) : boolean{
    console.log(typeof obj);
    if(typeof obj == 'object'){
      return true;
    }
  }

  delete(event, obj){
    event.preventDefault();
    console.log(obj);
    this.resourceService.saveResource('/admin/preleveur/delete/'+obj.id, null)
      .subscribe(data => {
        this.toastr.success("Suppression réussie.");
        this.getAllPreleveur();
      }, error => {

      });
  }

  public openConfirmationDialog(event: MouseEvent,obj) {
    event.preventDefault();
    this.confirmationDialogService.confirm('Confirmer la suppression', 'Voulez-vous supprimer cette ligne ?', 'Oui', 'Non')
      .then((confirmed) => {
        if (confirmed) {
          this.delete(event,obj);
        }

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  edit(event, obj : any){
    event.preventDefault();
    var image;
    image = 'data:image/png;base64,'+obj.imageSelfie;
    this.objUpdateImage = obj.imageSelfie;
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    this.urlFile = null;
    console.log(this.objUpdateImage);
    console.log(this.urlFile);

    if(obj.laboratoire != null){
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
          laboratoire: obj.laboratoire.id,
        }
      );
    }
    else {
      this.form.patchValue(
        {
          id : obj.id,
          birthday: obj.birthday,
          email: obj.email,
          imageSelfie: obj.imageSelfie,
          name: obj.name,
          phone: obj.phone,
          sexe: obj.sexe,
          password: "",
          username: obj.user.username,
          laboratoire: "",
        }
      );
    }

    console.log(obj);
  }

  update(){
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

    var preleveur = {
      birthday: this.form.get("birthday").value,
      email: this.form.get("email").value,
      imageSelfie: imageId,
      name: this.form.get("name").value,
      phone: this.form.get("phone").value,
      sexe: this.form.get("sexe").value,
      password: this.form.get("password").value,
      username: this.form.get("username").value,
      ville: "",
      laboratoire:{
        id:this.form.get("laboratoire").value
      },
      role: "PRELEVEUR",
    };
    console.log(preleveur);

    this.resourceService.saveResource("/admin/preleveur/update/"+this.form.get("id").value, preleveur)
      .subscribe(res => {
          result =res;
          this.spinner.hide();
          if(result.error_message == "Username Already Used"){
            this.toastr.error("Ce nom d’utilisateur existe déjà.");
          }
          else {
            this.getAllPreleveur();
            this.toastr.success("Mise à jour du préleveur réussie.");
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

}
