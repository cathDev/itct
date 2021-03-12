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
  imagePath : any = null;
  activeLang : number = 1;

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
      this.username = this.userConnected.user.username;
    }
    else{
      this.username = this.userConnected.username;
    }

    var user = this.userConnected.user;
    if(user.hasOwnProperty("imageSelfie")){
      console.log("je possède la propriété : imageSelfie");
      var image;
      image = 'data:image/png;base64,'+this.userConnected.user.imageSelfie;
      this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    }
  }

  logout(event){
    event.preventDefault();
    this.authenticationService.logout();
  }

  switchLang(language : string, langNum, event){
    event.preventDefault();
    this.translate.use(language);
    this.activeLang = langNum;
  }

}
