import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public host = environment.baseUrl;
  public message = "";

  constructor(private http: HttpClient,
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

  public getResourcesWithoutSecurity(url: string){
    return this.http.get(this.host + url);
  }

  public getResources(url: string){
    return this.http.get(this.host + url,this.getAuthenticationHeaders());
  }

  public getResourcesById(url: string, id:number){
    return this.http.get(this.host+url+"/"+id);
  }

  public getResourceByParam(url, params){
    return this.http.get(this.host+url, { params });
  }

  public deleteResource(url, id){
    return this.http.delete(this.host+url+"/"+id);

  }

  public saveResource(url, data:any): Observable<any[]>{
    return this.http.post<any[]>(this.host+url, data);
  }

  public resourceForLogin(url, data:any): Observable<any[]>{
    return this.http.post<any[]>(this.host+url, data);
  }

  public updateResource(url, data){
    return this.http.put(this.host+url, data);
  }
}
