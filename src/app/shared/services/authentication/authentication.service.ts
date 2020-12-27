
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {interval} from "rxjs/internal/observable/interval";
import {Router} from '@angular/router';
/*import {ToastrService} from 'ngx-toastr';*/
import {ResourceService} from '../resource/resource.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginUrl: string = "/client/auth/login";
  private logoutUrl: string = "/client/auth/logout";

  stopTimer: any;
  count: number = 0;
  counter: Observable<number> = interval(3000);

  constructor(
    private resourceService: ResourceService,
    private router: Router,
    /*private toastr: ToastrService,*/
  ) { }

  public login(user): Observable<any>{
    return this.resourceService.resourceForLogin(this.loginUrl, user);
  }

  public logout(){
  /*public logout(obj){*/
    localStorage.removeItem('userConnect');
    localStorage.removeItem('conected');
    localStorage.removeItem('token');
    this.router.navigateByUrl("/login");
    /*return this.resourceService.saveResource(this.logoutUrl, obj);*/
  }

  public isAuthenticate(){
    return localStorage.getItem('conected');
  }

  public getUserInLocalStorage(){
    return JSON.parse(localStorage.getItem('userConnect'));
  }

}
