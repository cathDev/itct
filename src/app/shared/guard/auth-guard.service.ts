import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router : Router, private authenticationService : AuthenticationService) { }

  canActivate() {
    if(this.authenticationService.isAuthenticate()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
