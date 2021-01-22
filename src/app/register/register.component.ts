import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../shared/services/authentication/authentication.service';
import {ResourceService} from '../shared/services/resource/resource.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';

declare function tools(): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  registerForm: FormGroup;
  urlProfilImage:any = null;
  urlPassportImage:any = null;
  passportType = [
    {
      id:1,
      label: 'ORDINNAIRE',
      value: 'ordinnaire',
    },
    {
      id:2,
      label: 'SERVICE',
      value: 'service',
    },
    {
      id:3,
      label: 'DIPLOMATIQUE',
      value: 'diplomatique',
    },
  ];

  pays : any = [];
  countryObject : any = {};
  dialCode: any;
  step1 : number = 1;
  step2 : number = 0;
  step3 : number = 0;


  constructor(
    private authenticationService : AuthenticationService,
    private router : Router,
    private formBuilder : FormBuilder,
    private resourceService : ResourceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    tools();
    this.initRegisterForm();
    this.allCountry();
  }

  enableStep1(){
    this.step1 = 1;
    this.step2 = 0;
    this.step3 = 0;
  }

  enableStep2(){
    this.step1 = 0;
    this.step2 = 1;
    this.step3 = 0;
  }

  enableStep3(){
    this.step1 = 0;
    this.step2 = 0;
    this.step3 = 1;
  }

  initRegisterForm() {
    this.registerForm = this.formBuilder.group({
      birthday: ['', Validators.required],
      dateExpiration: ['', Validators.required],
      email: ['', Validators.required],
      imageSelfie: ['', Validators.required],
      imagePassport: ['', Validators.required],
      name: ['', Validators.required],
      numeroPassport: ['', Validators.required],
      phone: ['', Validators.required],
      sexe: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      ville: ['', Validators.required],
      typePassport: ['', Validators.required],
      pays: ['', Validators.required],
    });
  }

  onFileChanged(event) {
    var imagePath;
    var base64Image;
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      /*this.message = "Only images are supported.";*/
      return;
    }

    const reader = new FileReader();
    imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.urlPassportImage = reader.result;
      console.log("voici le fichier");
      /*console.log(reader.result);*/
    }
  }

  uploadImageProfil(event) {
    var imagePath;
    var base64Image;
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      /*this.message = "Only images are supported.";*/
      return;
    }

    const reader = new FileReader();
    imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.urlProfilImage = reader.result;
      console.log("voici le fichier");
      /* console.log(reader.result);*/
    }
  }

  public register(){
    this.spinner.show();

    var typePassport;
    this.passportType.forEach(type => {
      if(type.id == this.registerForm.get("typePassport").value){
        console.log(type);
        typePassport = type;
      }
    });
    var imageId = "";
    var imagepassport = "";

    if(this.urlProfilImage != null) imageId = this.urlProfilImage.split(",")[1];

    if(this.urlPassportImage != null) imagepassport = this.urlPassportImage.split(",")[1];

    var patient = {
      birthday: this.registerForm.get("birthday").value,
      dateExpiration: this.registerForm.get("dateExpiration").value,
      email: this.registerForm.get("email").value,
      imageSelfie: imageId,
      imagePassport: imagepassport,
      name: this.registerForm.get("name").value,
      numeroPassport: this.registerForm.get("numeroPassport").value,
      phone: this.registerForm.get("phone").value,
      sexe: this.registerForm.get("sexe").value,
      password: this.registerForm.get("password").value,
      username: this.registerForm.get("username").value,
      typePassport: {
        id: this.registerForm.get("typePassport").value,
        libelle: typePassport.label
      },
      role: "PATIENT",
      ville: this.registerForm.get("ville").value
    };

    console.log(this.registerForm.value);
    var result;
    this.resourceService.resourceForLogin("/client/auth/register", patient)
      .subscribe(res => {
          result =  res;
          if(result.error_message == "Username Already Used"){
            this.toastr.error("Ce nom d'utilisateur existe déjà.");
          }
          else {
            this.spinner.hide();
            this.registerForm.reset();
            this.toastr.success("Votre compte a été enregistré avec succès.");
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error("Une erreur est survenue, reéssayez plus tard.");
          console.log(error);
        });
  }

  public passwordVisibility(pwd){
    console.log("click on password");
    pwd.type = pwd.type === 'password' ?  'text' : 'password';
  }

 public allCountry(){
   this.http.get("https://restcountries.eu/rest/v2/all")
     .subscribe(res => {
         this.pays = res;
         console.log(this.pays);
       },
       error => {
         console.log(error);
       });
 }

 public getDialCode(event){
    console.log(event.target.value);
    var code = (event.target.value).split(" ")[1];
    console.log(code);
    this.http.get("https://restcountries.eu/rest/v2/alpha/"+code)
      .subscribe(res => {
          this.countryObject = res;
          this.dialCode = "+"+this.countryObject.callingCodes[0];
          console.log(this.countryObject);
          console.log(this.dialCode);
        },
        error => {
          console.log(error);
        });
 }


}
