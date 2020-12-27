import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userConnected: any = {};

  constructor(private authenticationService : AuthenticationService,) { }

  ngOnInit() {
    this.userConnected = this.authenticationService.getUserInLocalStorage();
  }

  logout(event){
    event.preventDefault();
    this.authenticationService.logout();
  }

}
