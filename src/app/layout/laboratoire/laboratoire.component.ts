import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {ToastrService} from 'ngx-toastr';

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
  vaccinEffectuer: any = [];
  vaccins: any = [];
  dropdownSettings = {};


  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              ) { }

  ngOnInit() {
    this.initForm();
    this.getAllLabo();
    this.allVaccin();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nomVaccin',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 8,
      allowSearchFilter: true
    };

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
    console.log(this.vaccinEffectuer);
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

  public allVaccin(){
    this.resourceService.getResources("/vaccin/all")
      .subscribe(res => {
          this.vaccins = res;
          console.log(this.vaccins);
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

}
