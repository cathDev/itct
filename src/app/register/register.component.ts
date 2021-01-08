import { Component, OnInit } from '@angular/core';

declare function tools(): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    tools();
  }

  public passwordVisibility(pwd){
    console.log("click on password");
    pwd.type = pwd.type === 'password' ?  'text' : 'password';
  }

}
