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
  imagePath: string = "";
  urlFile: any;
  vaccinChecked: any;
  vaccins: any = [];

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
      service: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
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

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      /*this.message = "Only images are supported.";*/
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.urlFile = reader.result;
    }
  }

  addVaccin(){

  }

}
