
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {interval} from "rxjs/internal/observable/interval";
import {Router} from '@angular/router';
import {ResourceService} from '../resource/resource.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginUrl: string = "/client/auth/login";
  private logoutUrl: string = "/client/auth/logout";
  patient: any = {};

  stopTimer: any;
  count: number = 0;
  counter: Observable<number> = interval(3000);

  constructor(
    private resourceService: ResourceService,
    private router: Router,
  ) { }

  public login(user): Observable<any>{
    return this.resourceService.resourceForLogin(this.loginUrl, user);
  }

  public logout(){
  /*public logout(obj){*/
    /*localStorage.removeItem('userConnect');
    localStorage.removeItem('conected');
    localStorage.removeItem('token');*/
    localStorage.clear();
    this.router.navigateByUrl("/login");
    /*return this.resourceService.saveResource(this.logoutUrl, obj);*/
  }

  public isAuthenticate(){
    return localStorage.getItem('conected');
  }

  public getUserInLocalStorage(){
    return JSON.parse(localStorage.getItem('userConnect'));
  }

  public getPatient(){
    return this.patient;
  }

  public setPatient(obj){
    this.patient = obj;
  }

}
