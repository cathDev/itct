import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public host = environment.baseUrl;
  public message = "";
  public user = JSON.parse(localStorage.getItem('userConnect'));
  private sessionExpire : boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) {
    /*this.getTimes();
    this.invalidToken();*/

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
    this.invalidToken();
    return this.http.post<any[]>(this.host+url, data,this.getAuthenticationHeaders());
  }

  public resourceForLogin(url, data:any): Observable<any[]>{
    return this.http.post<any[]>(this.host+url, data);
  }

  public updateResource(url, data){
    return this.http.put(this.host+url, data);
  }

  public getTimes(){
    var heure;
    var heureInSecond;
    heure = new Date().toString().split(' ')[4];
    heure = heure.split(':');
    heureInSecond = ((Number(heure[0]) * 3600) + (Number(heure[1]) * 60) + Number(heure[2]));
    return heureInSecond;
  }

  public invalidToken(){
    console.log("voici le temps d'expiration");
    console.log(Number(localStorage.getItem('expireAt')));
    var actualTime = new Date();
    console.log("voici le temps de la requete");
    console.log(actualTime.getTime());
    var connexionDate = new Date(localStorage.getItem('conected_hour'));
    console.log("voici le temps de la connexion");
    console.log(connexionDate.getTime());
    var timeDif = (actualTime.getTime() - connexionDate.getTime());
    console.log("voici la difference de temps");
    console.log(timeDif);

    if(timeDif >= Number(localStorage.getItem('expireAt'))){
    /*if(timeDif >= 120000){*/
      localStorage.clear();
      this.sessionExpire = true;
      this.toastr.error("votre session a expiré");
      this.router.navigate(['/login']);
      return;
    }
  }

  public getSession(){
    return this.sessionExpire;
  }

}
