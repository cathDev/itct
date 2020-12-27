import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';

@Component({
  selector: 'app-laboratoire',
  templateUrl: './laboratoire.component.html',
  styleUrls: ['./laboratoire.component.css']
})
export class LaboratoireComponent implements OnInit {

  form : FormGroup;
  url: string = "/laboratoire";
  laboratoires : any = [];

  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,) { }

  ngOnInit() {
    this.initForm();
    this.getAllLabo();
  }

  initForm() {
    this.form = this.formBuilder.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      nom: ['', Validators.required],
      ville: ['', Validators.required],
    });
  }

  resetForm(){
    this.form.reset();
  }

  saveLabo(){

  }

  getAllLabo(){
    this.resourceService.getResourcesWithoutSecurity(this.url+"/all")
      .subscribe(res => {
        this.laboratoires = res;
        console.log(this.laboratoires);
      },
        error => {
        console.log(error);
        });
  }

}
