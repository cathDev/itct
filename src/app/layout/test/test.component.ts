import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';

declare function tools(): any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  tests : any = [];

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,) { }

  ngOnInit() {
    tools();
    this.allTest();
  }

  public resetForm(){

  }

  public allTest(){
    this.resourceService.getResources("/client/test/all")
      .subscribe(res => {
          this.tests = res;
          console.log(this.tests);
        },
        error => {
          console.log(error);
        });
  }

}
