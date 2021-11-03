import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  form: FormGroup;
  formTuteur: FormGroup;
  selectedlien: any;
  fileName: string;
  filePreview: string;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  loginError: String = "";
  imgBase64Path: any;
  mondomaine = localStorage.getItem('domaine');
  employe: any;
  // ==============================================
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  // =================== AUTH INFO ===========================
  currentEmploye = this.Employe[0];
  base64: string;
  action_addtuteur: any;
  tabletuteurs: any;
  displayedColumns_tabletuteurs: string[] = ['lien', 'nom', 'prenom', 'email', 'actions'];
  // ==============================================
  constructor(
    private router: Router,
    public apidb: ApidbService,
    public datepipe: DatePipe,
  ) {
    this.form = new FormGroup({
      domaine: new FormControl(this.mondomaine),
      image: new FormControl(''),
      datenaissance: new FormControl(this.currentEmploye.datenaissance, [Validators.required]),
      gsm2: new FormControl(this.currentEmploye.gsm2, [Validators.required]),
      adresse1: new FormControl(this.currentEmploye.adresse1, [Validators.required]),
      adresse2: new FormControl(this.currentEmploye.adresse2, [Validators.required]),
      codepostal: new FormControl(this.currentEmploye.codepostal, [Validators.required]),
      pays: new FormControl(this.currentEmploye.pays, [Validators.required]),
      nationalite: new FormControl(this.currentEmploye.nationalite, [Validators.required]),
      ville: new FormControl(this.currentEmploye.ville, [Validators.required]),
      genre: new FormControl(this.currentEmploye.genre, [Validators.required]),
      situation: new FormControl(this.currentEmploye.situation, [Validators.required]),
    });
    // --------------
    this.formTuteur = new FormGroup({
      Tuteur_lien: new FormControl('', [Validators.required]),
      Tuteur_autrelien: new FormControl(''),
      Tuteur_nom: new FormControl('', [Validators.required]),
      Tuteur_prenom: new FormControl('', [Validators.required]),
      Tuteur_email: new FormControl('', [Validators.required]),
      Tuteur_adresse1: new FormControl('', [Validators.required]),
      Tuteur_adresse2: new FormControl('', [Validators.required]),
      Tuteur_pays: new FormControl('', [Validators.required]),
      Tuteur_ville: new FormControl('', [Validators.required]),
    });
    // --------------
  }

  ngOnInit() {
    this.gettuteurs();
    this.apidb.getList('employe', { 'email': this.currentEmploye.email }).subscribe(
      (dataemploye) => {
        debugger
        this.employe = dataemploye[0];
        this.currentEmploye = dataemploye[0];
        this.apidb
          .getList('getged', {
            contexte: 'CV',
            libelle: 'photo',
            referenceprincipale: this.currentEmploye.id,
            type: 'PHOTO'
          })
          .subscribe((data) => {
            this.cardImageBase64 = data[0].image;
          });
      },
      err => {
        Swal.fire('Erreur...', err.error.msg, 'error');
      }
    );
  }
  // ----------------------
  onFileChanged(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileName = file.name + " " + file.type;
        this.filePreview = 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1];
        this.base64 = 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1];
        this.form.patchValue(
          {
            image: 'data:image/png' + ';base64,' + (<string>reader.result).split(',')[1],
          });
      };
    }
  }
  // ----------------------
  readFile(file: File, subscriber: Subscriber<any>) {
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

  inscription() {
    var domaine = this.form.get('domaine').value;
    var gsm2 = this.form.get('gsm2').value;
    var image = this.imgBase64Path;
    // var datenaissance = this.datepipe.transform(this.form.get('datenaissance').value, 'yyyy-MM-dd');
    var adresse1 = this.form.get('adresse1').value;
    var adresse2 = this.form.get('adresse2').value;
    var codepostal = this.form.get('codepostal').value;
    var pays = this.form.get('pays').value;
    var nationalite = this.form.get('nationalite').value;
    var ville = this.form.get('ville').value;
    // var genre = this.form.get('genre').value;
    var situation = this.form.get('situation').value;
    debugger
    this.employe.image = image;
    this.employe.gsm2 = gsm2;
    this.employe.adresse1 = adresse1;
    this.employe.adresse2 = adresse2;
    this.employe.codepostal = codepostal;
    this.employe.pays = pays;
    this.employe.nationalite = nationalite;
    this.employe.ville = ville;
    // this.employe.genre = genre;
    this.employe.situation = situation;
    // this.employe.datenaissance = datenaissance;
    debugger
    this.apidb.modifierEnregistrement('employevalider', this.employe).subscribe(
      data => {
        this.apidb
          .addEnregistrement('setged',
            {
              contexte: 'CV',
              image: image,
              libelle: 'photo',
              referenceprincipale: this.employe.id,
              type: 'PHOTO'
            }
          )
          .subscribe((data) => {
            debugger

          });
        this.apidb.getList('employe', { 'email': this.currentEmploye.email }).subscribe(
          (dataemploye) => {
            debugger
            localStorage.removeItem('currentEmploye');
            localStorage.setItem('currentEmploye', JSON.stringify(dataemploye));
          },
          err => {
            this.loginError = err.error.msg;
            Swal.fire('Erreur...', err.error.msg, 'error');
          }
        );
        Swal.fire('Enregistré avec succès', 'Inscription éfféctué avec succès', 'success');
        this.router.navigate(['/home/listechoix']);
      },
      err => {
        this.loginError = err.error.msg;
        Swal.fire('Erreur...', err.error.msg, 'error');
      }
    );
  }
  // ----------------------
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
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
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            this.imgBase64Path = e.target.result;
            this.cardImageBase64 = this.imgBase64Path;
            this.isImageSaved = true;
            // this.previewImagePath = imgBase64Path;
            // console.log(this.imgBase64Path);
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
  // ----------------------

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  // ----------------------
  gettuteurs() {
    this.apidb.getList('employecontact', { idemploye: this.currentEmploye.id }).subscribe((datatuteurs) => {
      this.tabletuteurs = datatuteurs;
      debugger
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des tuteurs', 'error');
      }
    );
  }
  // ----------------------


  addTuteur() {
    var idemloye = this.currentEmploye.id;
    var Tuteur_lien = this.formTuteur.get('Tuteur_lien').value;
    var Tuteur_autrelien = this.formTuteur.get('Tuteur_autrelien').value;
    var Tuteur_nom = this.formTuteur.get('Tuteur_nom').value;
    var Tuteur_prenom = this.formTuteur.get('Tuteur_prenom').value;
    var Tuteur_email = this.formTuteur.get('Tuteur_email').value;
    var Tuteur_adresse1 = this.formTuteur.get('Tuteur_adresse1').value;
    var Tuteur_adresse2 = this.formTuteur.get('Tuteur_adresse2').value;
    var Tuteur_pays = this.formTuteur.get('Tuteur_pays').value;
    var Tuteur_ville = this.formTuteur.get('Tuteur_ville').value;
    debugger
    this.apidb.addEnregistrement('employecontact',
      {
        idemploye: idemloye,
        lien: Tuteur_lien,
        autrelien: Tuteur_autrelien,
        nom: Tuteur_nom,
        prenom: Tuteur_prenom,
        email: Tuteur_email,
        adresse1: Tuteur_adresse1,
        adresse2: Tuteur_adresse2,
        pays: Tuteur_pays,
        ville: Tuteur_ville,
      }).subscribe(
        data => {
          Swal.fire('Enregistré avec succès', 'Tuteur ajouté', 'success');
          this.gettuteurs();
          this.action_addtuteur = 0;
        },
        err => {
          this.loginError = err.error.msg;
          Swal.fire('Erreur...', err.error.msg, 'error');
        }
      );
  }
  // -----------------------
  select_addtuteur() {
    this.action_addtuteur = 1;
  }

}
