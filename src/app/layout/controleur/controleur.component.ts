import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';

@Component({
  selector: 'app-controleur',
  templateUrl: './controleur.component.html',
  styleUrls: ['./controleur.component.css']
})
export class ControleurComponent implements OnInit {

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
