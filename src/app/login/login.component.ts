import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../shared/services/authentication/authentication.service';
import {ResourceService} from '../shared/services/resource/resource.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';

/*declare function tools(): any;*/
declare function loginEvent(): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  message: string = "";
  messageSessionExpire: string = "";
  urlProfilImage:any;
  urlPassportImage:any;

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

  constructor(private authenticationService : AuthenticationService,
              private router : Router,
              private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              ) {

  }


  ngOnInit() {
    loginEvent();
    this.initForm();
    this.initRegisterForm();

    if(this.authenticationService.isAuthenticate()){
      this.router.navigateByUrl("/dashboard");
    }

    /*this.messageSessionExpire = this.resourceService.getSession();*/
    /*if(this.resourceService.getSession() == true){
      console.log(this.resourceService.getSession());
      this.toastr.error("Votre session a expiré.");
    }*/

  }

  /*ngAfterViewInit() {
    if (this.resourceService.getSession() == true) {
      setTimeout(() => {
        this.toastr.success('Register Successful, please login');
      }, 3);
    }
  }*/

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
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
      /*pays: ['', Validators.required],*/
    });
  }

  get f() { return this.loginForm.controls; }

  public onLogin() {
    this.spinner.show();

    var response ;

    this.authenticationService.login(this.loginForm.value)
      .subscribe(res => {
        response = res;
        var date;
        if(response.authenticationToken != null){
          localStorage.setItem('userConnect', JSON.stringify(response));
          localStorage.setItem('conected', 'true');
          date = new Date();
          localStorage.setItem('conected_hour', date);
          localStorage.setItem('token', response.authenticationToken);
          localStorage.setItem('expireAt', response.expiresAt);
          this.message = "";
          this.router.navigate(['/dashboard']);
        }
        else {
          this.router.navigate(['/login']);
          this.message = "Nom d'utilisateur ou mot de passe incorrect.";
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.message = "Nom d'utilisateur ou mot de passe incorrect.";
      });
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

    var imageId = this.urlProfilImage.split(",")[1];
    var imagepassport = this.urlPassportImage.split(",")[1];

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

    console.log(patient);

      this.resourceService.resourceForLogin("/client/auth/register", patient)
        .subscribe(res => {
            this.spinner.hide();
            this.registerForm.reset();
            this.toastr.success("Opération effectuée avec succès.");
          },
          error => {
            this.spinner.hide();
            this.toastr.success("Une erreur est survenue, reéssayez plus tard.");
            console.log(error);
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

  public passwordVisibility(pwd){
    console.log("click on password");
    pwd.type = pwd.type === 'password' ?  'text' : 'password';
  }

}
