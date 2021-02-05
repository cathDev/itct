import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public host = environment.baseUrl;
  public message = "";
  public user = JSON.parse(localStorage.getItem('userConnect'));

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) {

  }

  public getAuthenticationHeaders(){
    console.log('setting')
    let token = localStorage.getItem('token');
    let tokenType = "Bearer";
    let finalToken = tokenType + " "+token;

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': finalToken
      })
    };
  }

  public getResources(url: string){
    this.invalidToken();
    return this.http.get(this.host + url,this.getAuthenticationHeaders());
  }

  public getResourcesWithoutSecurity(url: string){
    return this.http.get(this.host + url);
  }

  public getResourcesById(url: string, id:any){
    this.invalidToken();
    return this.http.get(this.host+url+"/"+id, this.getAuthenticationHeaders());
  }

  public getResourceByParam(url, params: HttpParams){
    this.invalidToken();
    return this.http.get(this.host+url, {params: params });
  }

  public deleteResource(url, id){
    return this.http.delete(this.host+url+"/"+id);

  }

  public saveResource(url, data:any): Observable<any[]>{
    this.invalidToken();
    return this.http.post<any[]>(this.host+url, data,this.getAuthenticationHeaders());
  }

  public resourceForLogin(url, data:any): Observable<any[]>{
    return this.http.post<any[]>(this.host+url, data);
  }

  public updateResource(url, data){
    return this.http.put(this.host+url, data);
  }

  public invalidToken(){

    let token = localStorage.getItem('token');
    let helper = new JwtHelperService();
    let isExpired = helper.isTokenExpired(token);
    console.log("le token est expiré ? " +isExpired);

    if(isExpired == true){
      localStorage.removeItem('userConnect');
      localStorage.removeItem('conected');
      localStorage.removeItem('token');
      localStorage.removeItem('expireAt');
      this.toastr.error("Votre session a expiré.");

      this.router.navigate(['/login']);
      return;
    }

  }

}
