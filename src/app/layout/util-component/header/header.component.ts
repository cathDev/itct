import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/services/authentication/authentication.service';
import {UtilsService} from '../../../shared/services/utils/utils.service';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userConnected: any = {};
  username = "";

  constructor(
    private authenticationService : AuthenticationService,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private sanitizer:DomSanitizer

  ) { }

  ngOnInit() {
    this.userConnected = this.authenticationService.getUserInLocalStorage();
    console.log(this.userConnected);

    if(this.userConnected.role== "LABORANTIN"){
      this.username = this.userConnected.laboratoire.username;
    }
    else{
      this.username = this.userConnected.username;
    }

    /*
    var image
         image = 'data:image/png;base64,'+this.userConnected.imageSelfie;
         this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
         imagePassport = 'data:image/png;base64,'+this.patient.imagePassport;
         this.imagePassport = this.sanitizer.bypassSecurityTrustResourceUrl(imagePassport);
         console.log(this.patient);*/

  }

  logout(event){
    event.preventDefault();
    this.authenticationService.logout();
  }

  switchLang(language : string, event){
    event.preventDefault();
    this.translate.use(language);
  }

}
