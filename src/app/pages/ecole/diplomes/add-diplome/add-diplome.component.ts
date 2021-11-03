import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { ApidbService } from 'src/app/services/apidb.service';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { routes } from 'src/app/consts';

@Component({
  selector: 'app-add-diplome',
  templateUrl: './add-diplome.component.html',
  styleUrls: ['./add-diplome.component.scss']
})
export class AddDiplomeComponent implements OnInit {
  public routes: typeof routes = routes;
  formAddDiplome: FormGroup;
  selectedCtrlName: any;
  selecteddiplome = '';
  // ---------------------
  fileName_1: string;
  filePreview_1: string;
  imageError_1: string;
  isImageSaved_1: boolean;
  cardImageBase64_1: string;
  imgBase64Path_1: any;
  base64_1: any = "";
  // ---------------------
  // ---------------------
  fileName_2: string;
  filePreview_2: string;
  imageError_2: string;
  isImageSaved_2: boolean;
  cardImageBase64_2: string;
  imgBase64Path_2: any;
  base64_2: any = "";
  // ---------------------
  currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
  // ---------------------
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  currentEmploye: any = this.Employe[0];


  constructor(
    private router: Router,
    public apidb: ApidbService,
    public loaderinterceptor: LoaderService,
    public datepipe: DatePipe
  ) {
    this.formAddDiplome = new FormGroup({
      idemploye: new FormControl(''),
      datedebut: new FormControl('', [Validators.required]),
      datefin: new FormControl('', [Validators.required]),
      etablissement: new FormControl('', [Validators.required]),
      mention: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      pays: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      image2: new FormControl(''),
      diplome: new FormControl('', [Validators.required]),
      intitule: new FormControl('', [Validators.required]),
      option: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  options = [
    { key: '1', label: 'Niveau baccalauréat' },
    { key: '2', label: 'baccalauréat' },
    { key: '3', label: 'Téchnicien' },
    { key: '4', label: 'Technicien spécialisé' },
    { key: '4', label: 'DEUG' },
    { key: '5', label: 'Licence' },
    { key: '6', label: 'Master' },
    { key: '7', label: 'Doctorat' },
  ]

  AddDiplome() {
    var idemploye = this.currentUser.idemploye;
    var datedebut = this.datepipe.transform(this.formAddDiplome.get('datedebut').value, 'yyyy-MM-dd');
    var datefin = this.datepipe.transform(this.formAddDiplome.get('datefin').value, 'yyyy-MM-dd');
    var etablissement = this.formAddDiplome.get('etablissement').value;
    var mention = this.formAddDiplome.get('mention').value;
    var ville = this.formAddDiplome.get('ville').value;
    var pays = this.formAddDiplome.get('pays').value;
    var image = this.imgBase64Path_1;
    var image2 = this.imgBase64Path_2;
    var diplome = this.formAddDiplome.get('diplome').value;
    var intitule = this.formAddDiplome.get('intitule').value;
    var option = this.formAddDiplome.get('option').value;
    this.apidb.addEnregistrement('employediplomes', {
      'idemploye': idemploye,
      'datedebut': datedebut,
      'datefin': datefin,
      'etablissement': etablissement,
      'mention': mention,
      'ville': ville,
      'pays': pays,
      'diplome': diplome,
      'image': image,
      'image2': image2,
      'intitule': intitule,
      'option': option,

    }).subscribe(
      (data) => {
        Swal.fire('Succès...', 'Diplôme ajouté avec succés', 'success');
        this.router.navigate(['diplomes'])
      },
      err => {
        Swal.fire('Erreur...', err.error.msg, 'error');
      }
    );
    // console.log(image)
  }

  onFileChanged_1(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileName_1 = file.name + " " + file.type;
        this.filePreview_1 = 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1];
        this.base64_1 = 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1];
        this.formAddDiplome.patchValue(
          {
            image: 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1],
          });
      };
    }
  }
  onFileChanged_2(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileName_2 = file.name + " " + file.type;
        this.filePreview_2 = 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1];
        this.base64_2 = 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1];
        this.formAddDiplome.patchValue(
          {
            image: 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1],
          });
      };
    }
  }

  // ----------------------

  readFile_1(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      console.log(file);
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }
  // ----------------------
  fileChangeEvent_1(fileInput: any) {
    this.imageError_1 = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError_1 =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError_1 = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          if (img_height > max_height && img_width > max_width) {
            this.imageError_1 =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            this.imgBase64Path_1 = e.target.result;
            this.cardImageBase64_1 = this.imgBase64Path_1;
            this.isImageSaved_1 = true;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage_1() {
    this.cardImageBase64_1 = null;
    this.isImageSaved_1 = false;
  }
  // ----------------------
  // ----------------------
  readFile_2(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      console.log(file);
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }
  // ----------------------
  fileChangeEvent_2(fileInput: any) {
    this.imageError_2 = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError_2 =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError_2 = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          // console.log(img_height, img_width);
          if (img_height > max_height && img_width > max_width) {
            this.imageError_2 =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            this.imgBase64Path_2 = e.target.result;
            this.cardImageBase64_2 = this.imgBase64Path_2;
            this.isImageSaved_2 = true;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage_2() {
    this.cardImageBase64_2 = null;
    this.isImageSaved_2 = false;
  }

}
