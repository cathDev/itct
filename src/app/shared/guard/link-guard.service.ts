import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class LinkGuardService implements  CanActivateChild{

  constructor(
    private authenticationService : AuthenticationService, private router : Router
  ) { }

  canActivateChild( route: ActivatedRouteSnapshot) {
    if(this.authenticationService.menuRole(route.data.url) == true){
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }

}
