import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../shared/services/authentication/authentication.service';

/*declare function slimscroll(): any;*/

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  user = this.authenticationService.getUserInLocalStorage();
  constructor(private authenticationService : AuthenticationService,) { }

  ngOnInit() {
   /* slimscroll();*/
  }

}
