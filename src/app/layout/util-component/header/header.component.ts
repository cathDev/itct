import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/services/authentication/authentication.service';
import {UtilsService} from '../../../shared/services/utils/utils.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userConnected: any = {};

  constructor(
    private authenticationService : AuthenticationService,
    private utilsService: UtilsService,
    private translate: TranslateService,

  ) { }

  ngOnInit() {
    this.userConnected = this.authenticationService.getUserInLocalStorage();
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
