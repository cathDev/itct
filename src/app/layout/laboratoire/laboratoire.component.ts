import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmationDialogService} from '../../shared/services/confirmationDialog/confirmation-dialog.service';
import {DomSanitizer} from '@angular/platform-browser';

declare var jQuery:any;

@Component({
  selector: 'app-laboratoire',
  templateUrl: './laboratoire.component.html',
  styleUrls: ['./laboratoire.component.css']
})
export class LaboratoireComponent implements OnInit {

  form : FormGroup;
  url: string = "/laboratoire";
  laboratoires : any = [];
  country : any = [];
  cities : any = [];
  imagePath: any;
  logoFile: any ;
  urlFile: any;
  vaccinChecked: any;
  vaccinEffectuer: any = [];
  paysSelectionner: any;
  vaccins: any = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  objUpdateImage: any;


  p: number = 1;
  items: number = 8;

  service = [];

  //variable for translation
  deleteTitle : string = "Delete the laboratory";
  updateTitle : string = "Modify the laboratory";


  constructor(private formBuilder : FormBuilder,
              private resourceService : ResourceService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private confirmationDialogService: ConfirmationDialogService,
              private sanitizer:DomSanitizer
              ) { }

  ngOnInit() {
    this.initForm();
    this.getAllLabo();
    this.allVaccin();
    this.allCountry();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nomVaccin',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 8,
      allowSearchFilter: true
    };

    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'id',
      textField: 'label',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 8,
      allowSearchFilter: true
    };

  }

  initForm() {
    this.form = this.formBuilder.group({
      id: '',
      name: ['', Validators.required],
      country: ['', Validators.required],
      imageSelfie: ['', Validators.required],
      city: ['', Validators.required],
      test: ['', Validators.required],
      vaccin: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      vaccins: ['', Validators.required],
    });
  }

  resetForm(){
    this.form.reset();
  }

  saveLabo(){

    if(!(this.form.get("vaccin").value) && !(this.form.get("test").value)) {
      this.toastr.error("Veuillez cocher au moins un service.");
      return;
    }

    var result;

    var imageId = "";
    if(this.urlFile != null) imageId = this.urlFile.split(",")[1];
    if(this.service.length < 2){
      if(this.form.get("test").value)  this.service.push("TEST COVID");
      if(this.form.get("vaccin").value)  this.service.push("VACCIN");
    }

    var vac = [];
    this.vaccinEffectuer.forEach(item => {
      vac.push(item.nomVaccin);
    });

    var pays = this.form.get("country").value;

    var labo = {
      name : this.form.get("name").value,
      country : pays[0].label,
      city : {
        id : this.form.get("city").value
      },
      username : this.form.get("username").value,
      password : this.form.get("password").value,
      vaccins : vac,
      imageSelfie : imageId,
      typeService : this.service,
      role : "LABORANTIN"
    };

    this.resourceService.resourceForLogin("/client/auth/register", labo)
      .subscribe(res => {
        result = res;
          this.spinner.hide();
          if(result.error_message == "Username Already Used"){
            this.toastr.error("Ce nom d'utilisateur existe déjà.");
          }
          else {
            this.getAllLabo();
            this.form.reset();
            this.urlFile = null;
            this.toastr.success("Laboratoire enregistré avec succès.");
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error("Une erreur est survenue, réessayez plus tard.");
          console.log(error);
        });

    console.log(labo);

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

  public allCountry(){
    this.resourceService.getResources("/client/country/all")
      .subscribe(res => {
          this.country = res;
          console.log(this.country);
        },
        error => {
          console.log(error);
        });
  }

  public allCitiesByCountry(event){

    console.log(event);
    var country = event;
    this.resourceService.getResources("/client/country/"+country.id+"/city")
      .subscribe(res => {
          this.cities = res;
          console.log(this.cities);
        },
        error => {
          console.log(error);
        });
  }

  edit(event, obj : any){
    event.preventDefault();
    var image;
    image = 'data:image/png;base64,'+obj.imageSelfie;
    this.objUpdateImage = obj.imageSelfie;
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    this.urlFile = null;

    if(obj.typeService.includes("VACCIN")){
      this.vaccinChecked = true;
      this.form.get("vaccin").setValue(true);
    }

    if(obj.typeService.includes("TEST COVID")){
      this.vaccinChecked = true;
      this.form.get("test").setValue(true);
    }

    this.form.patchValue(
      {
        id : obj.id,
        name: obj.name,
        imageSelfie: obj.imageSelfie,
        country: obj.city.country,
        city: obj.city.id,
        password: "",
        username: obj.username,
        vaccins: obj.vaccins,
      }
    );

    this.allCitiesByCountry(obj.city.country);

    var paysTab = [];
    paysTab.push(obj.city.country);
    this.paysSelectionner = paysTab;

    this.vaccinEffectuer = obj.vaccins;

    console.log(obj);
    console.log(obj.city.country);
    console.log(this.form.value);
  }

  update(){
    console.log(this.form.value);

    if(!(this.form.get("vaccin").value) && !(this.form.get("test").value)) {
      this.toastr.error("Veuillez cocher au moins un service.");
      return;
    }

    this.spinner.hide();
    var result;
    var imageId = new String("");
    if(this.urlFile != null){
      imageId = this.urlFile.split(",")[1];
      console.log("c'est différent de null");
    }
    else{
      imageId = this.form.get("imageSelfie").value;
    }


      if((this.form.get("test").value) && !(this.service.includes("TEST COVID")))  this.service.push("TEST COVID");
      if((this.form.get("vaccin").value) && !(this.service.includes("VACCIN")))  this.service.push("VACCIN");

      if(!(this.form.get("test").value) && (this.service.includes("TEST COVID"))) {
        const index = this.service.indexOf("TEST COVID");
        if (index > -1) {
          this.service.splice(index, 1);
        }
      }

      if(!(this.form.get("vaccin").value) && (this.service.includes("VACCIN"))) {
        const index = this.service.indexOf("VACCIN");
        if (index > -1) {
          this.service.splice(index, 1);
        }
      }

    if(!(this.form.get("vaccin").value)) this.vaccinEffectuer = [];

    var vac = [];
    this.vaccinEffectuer.forEach(item => {
      if(typeof item == "string"){
        vac.push(item);
      }
      else {
        vac.push(item.nomVaccin);
      }
    });

    console.log(this.vaccinEffectuer);


    var pays = this.form.get("country").value;

    var labo = {
      name : this.form.get("name").value,
      country : pays[0].label,
      city : {
        id : this.form.get("city").value
      },
      username : this.form.get("username").value,
      password : this.form.get("password").value,
      vaccins : vac,
      imageSelfie : imageId,
      typeService : this.service,
      role : "LABORANTIN"
    };

    console.log(labo);

    this.resourceService.saveResource("/laboratoire/update/"+this.form.get("id").value, labo)
      .subscribe(res => {
          result =res;
          this.spinner.hide();
          if(result.error_message == "Username Already Used"){
            this.toastr.warning("Ce nom d’utilisateur existe déjà.");
          }
          else {
            this.getAllLabo();
            this.toastr.success("Mise à jour du laboratoire réussie.");
            this.form.reset();
            jQuery("#myModal").modal("hide");
            this.urlFile = null;
            this.imagePath = null;
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error("Une erreur est survenue, réessayez plus tard.");
          console.log(error);
        });
  }

  delete(event, obj){
    event.preventDefault();
    console.log(obj);
    this.resourceService.saveResource('/laboratoire/delete/'+obj.id, null)
      .subscribe(data => {
        this.toastr.success("Suppression réussie.");
        this.getAllLabo();
      }, error => {

      });
  }

  public openConfirmationDialog(event: MouseEvent,obj) {
    event.preventDefault();
    this.confirmationDialogService.confirm('Confirmer la suppression', 'Voulez-vous supprimer cette ligne ?', 'Oui', 'Non')
      .then((confirmed) => {
        if (confirmed) {
          this.delete(event,obj)
        }

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


}
