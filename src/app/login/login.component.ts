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
  message: string = "";
  messageSessionExpire: string = "";

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
    /*this.messageSessionExpire = this.resourceService.getSession();*/
    /*if(this.resourceService.getSession() == true){
      console.log(this.resourceService.getSession());
      this.toastr.error("Votre session a expiré.");
    }*/

  }

  ngAfterViewInit() {
    if (this.resourceService.getSession() == true) {
      setTimeout(() => {
        this.toastr.success('Register Successful, please login');
      }, 3);
    }
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
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

  public passwordVisibility(pwd){
    console.log("click on password");
    pwd.type = pwd.type === 'password' ?  'text' : 'password';
  }

}
