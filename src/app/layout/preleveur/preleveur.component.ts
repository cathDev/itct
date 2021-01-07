import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ResourceService} from '../../shared/services/resource/resource.service';

@Component({
  selector: 'app-preleveur',
  templateUrl: './preleveur.component.html',
  styleUrls: ['./preleveur.component.css']
})
export class PreleveurComponent implements OnInit {
  url: string = "";
  laboratoires : any = [];
  imagePath: string = "";
  urlFile: any;
  preleveurs: any = [];


  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getAllLabo();

  }

  save(){
    console.log();
  }

  getAllLabo(){
    this.resourceService.getResourcesWithoutSecurity("/laboratoire/all")
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

}
