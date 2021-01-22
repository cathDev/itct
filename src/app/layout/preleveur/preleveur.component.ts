import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-preleveur',
  templateUrl: './preleveur.component.html',
  styleUrls: ['./preleveur.component.css']
})
export class PreleveurComponent implements OnInit {
  url: string = "";
  laboratoires : any = [];
  imagePath: string = "";
  urlFile: any;
  preleveurs: any = [];
  form : FormGroup;


  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.getAllLabo();
    this.initForm();

  }

  initForm() {
    this.form = this.formBuilder.group({
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
            this.toastr.warning(result.error_message+".");
          }
          else {
            this.toastr.success(result.message+".");
            this.form.reset();
            this.urlFile = null;
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error("Une erreur est survenue, reéssayez plus tard.");
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

  public resetForm(){
    this.form.reset();
  }

}
