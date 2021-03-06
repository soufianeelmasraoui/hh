import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listchoix',
  templateUrl: './listchoix.component.html',
  styleUrls: ['./listchoix.component.scss']
})
export class ListchoixComponent implements OnInit {
  // ==============================================
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  // =================== AUTH INFO ===========================
  currentEmploye = this.Employe[0];
  // -------------------------
  displayedColumns: string[] = ['cible3', 'niveau', 'actions'];
  displayedColumns_meschoix: string[] = ['cible', 'cible2', 'cible3', 'actions'];
  displayedColumns_meschoixvalide: string[] = ['cible', 'cible2', 'cible3', 'actions'];
  displayedColumns_choixconfirme: string[] = ['cible', 'cible2', 'cible3'];
  displayedColumns_choixaccepte: string[] = ['cible', 'cible2', 'cible3'];
  tablechoix = [];
  tablemeschoix: any;
  tablemeschoixvalide: any;
  dataSource = new MatTableDataSource(this.tablechoix);
  currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
  choix = [];
  choix_cible = [];
  frmchoix: FormGroup;
  action: number;
  choix_cible2: any;
  cible: any;
  cible2: any;
  cible3: any;
  tablemeschoixconfirme: any;
  hidefairechoix: number;
  cible1: any;
  // -------------------------
  frmchoixniveau: FormGroup;
  tablemeschoixaccepte: any;
  constructor(public apidb: ApidbService,) {
    this.frmchoix = new FormGroup({
      cible: new FormControl('', [Validators.required]),
      cible1: new FormControl('', [Validators.required]),
      cible2: new FormControl('', [Validators.required]),
      cible3: new FormControl('', [Validators.required]),
    })
    this.frmchoixniveau = new FormGroup({
      niveau: new FormControl('', [Validators.required]),
      cible1: new FormControl('', [Validators.required]),
    })
  }
  ngOnInit(): void {
    this.AddChoix();
    this.choixcible();
    this.meschoix();
    this.meschoixvalide();
    this.meschoixconfirme();
    this.checkfairechoix();
    this.meschoixaccepte();
  }

  checkfairechoix() {
    this.apidb.getList('employecvpossibilite', { 'idemploye': this.currentEmploye.id, 'idstatut': 2 }).subscribe((meschoix) => {
      if (meschoix.length >= 3) {
        this.hidefairechoix = 1;
        let timerInterval
        Swal.fire({
          title: 'Attention !',
          html: 'Vous vous avez atteint la limite des choix souhait??s',
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
        })
      }
      else {
        this.hidefairechoix = 0;
      }
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }
    );
  }

  AddChoix() {
    this.apidb.addEnregistrement('employecvpossibilite', { 'idemp': this.currentUser.idemploye }).subscribe((datachoix) => {
      this.choixcible();
      this.meschoix();
      this.meschoixvalide();
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }

    );
  }
  choixcible() {
    this.apidb.getList('cvpossibilite', {}).subscribe((datachoix) => {
      this.choix = datachoix
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }

    );
  }

  onchange() {
    var selectedcible: any = this.frmchoix.get("cible").value;
    this.cible = selectedcible;
    this.apidb.getList('cvpossibilite1', { cible: selectedcible })
      .subscribe((datacc) => {
        this.choix_cible = datacc
        this.apidb.getList('employecvpossibilitechoix', { idemploye: this.currentEmploye.id, cible: selectedcible })
          .subscribe((datachoix) => {
            // this.tablechoix = datachoix;
            this.frmchoix.get("cible2").reset();
            this.frmchoix.get("cible3").reset();
            this.choix_cible2 = null;
            this.tablechoix = null;
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
            }
          );
      },
        err => {
          Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
        }

      );
  }
  // --------------
  onchange2() {
    var selectedcible1: any = this.frmchoix.get("cible1").value;
    this.cible1 = selectedcible1;

    this.apidb.getList('cvpossibilite2', { cible: this.cible, cible1: selectedcible1 }).subscribe((datacc2) => {
      this.choix_cible2 = datacc2
      this.apidb.getList('employecvpossibilitechoix', { idemploye: this.currentEmploye.id, cible: this.cible, cible2: this.cible2 }).subscribe((datachoix) => {
        this.tablechoix = null;
        this.frmchoix.get("cible3").reset();
      },
        err => {
          Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
        }
      );
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }

    );
  }
  // --------------
  onchange3() {
    var selectedcible2: any = this.frmchoix.get("cible2").value;
    this.cible2 = selectedcible2;
    // this.apidb.getList('employecvpossibilitechoix', { idemploye: this.currentEmploye.id, cible: this.cible, cible1: this.cible2, cible2: this.cible2 }).subscribe((datachoix) => {
    //   this.tablechoix = datachoix;
    // },
    //   err => {
    //     Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
    //   }
    // );
    this.apidb.getList('employecvpossibilitechoix', { idemploye: this.currentEmploye.id, cible: this.cible, cible1: this.cible1, cible2: this.cible2 }).subscribe((datachoix) => {
      this.tablechoix = datachoix;
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }
    );
  }
  // --------------
  listchoix() {
    this.apidb.getList('employecvpossibilite', { 'idemploye': this.currentEmploye.id, 'idstatut': 1 }).subscribe((dataemployechoix) => {
      this.tablechoix = dataemployechoix
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }

    );
  }
  // --------------
  meschoix() {
    this.apidb.getList('employecvpossibilite', { 'idemploye': this.currentEmploye.id, 'idstatut': 2 }).subscribe((meschoix) => {
      this.tablemeschoix = meschoix
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }
    );
  }
  // --------------
  meschoixvalide() {
    this.apidb.getList('employecvpossibilite', { 'idemploye': this.currentEmploye.id, 'idstatut': 3 }).subscribe((meschoixvalide) => {
      this.tablemeschoixvalide = meschoixvalide
      this.meschoixconfirme();
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }
    );
  }
  // --------------
  meschoixconfirme() {
    this.apidb.getList('employecvpossibilite', { 'idemploye': this.currentEmploye.id, 'idstatut': 4 }).subscribe((meschoixconfirme) => {
      this.tablemeschoixconfirme = meschoixconfirme;
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }
    );
  }
  // --------------
  meschoixaccepte() {
    this.apidb.getList('employecvpossibilite', { 'idemploye': this.currentEmploye.id, 'idstatut': 5 }).subscribe((meschoixaccepte) => {
      this.tablemeschoixaccepte = meschoixaccepte;
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }
    );
  }

  // radioChange(event: MatRadioChange, data) {
  //   var obj = this.someName.filter(x => x.id == data.id)[0];
  //   obj.selected = event.value;
  //   if (!this.finalArray.some(x => x.id == data.id)) {
  //     this.finalArray.push(obj);
  //   }
  onsubmit() {
    var cible: any = this.frmchoix.get("cible").value;
    var cible2: any = this.frmchoix.get("cible2").value;
    this.apidb.addEnregistrement('employecvpossibilite', {
      'idemp': this.currentUser.idemploye,
      'cible': cible,
      'cible2': cible2,
      'idstatut': 2
    }).subscribe((data) => {
      Swal.fire('Success', 'Ajout??', 'success');
      this.listchoix();
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
      }
    );
  }
  // --------------
  Valider_choix(choix: any) {
    Swal.fire({
      title: "Valider le choix",
      html:
        `Voulez-vous vraiment valider ce choix `,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Valider"
    }).then(result => {
      if (result.value) {
        var body = {
          id: choix.id,
          idstatut: 2,
          statut: 'choisi',
        };
        debugger
        console.log(choix);

        this.apidb.getList('employecvpossibilitevalide', body).subscribe((choixvalide) => {
          Swal.fire('Succ??s', 'Choix valid??', 'success');
          this.listchoix();
          this.choixcible();
          this.meschoix();
          this.meschoixvalide();
          this.checkfairechoix();
          this.action = 2;
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
          }
        );
      }
    });
  }
  // --------------
  Valider_choixstatut4(choix: any) {
    Swal.fire({
      title: "Valider le choix",
      html:
        `Voulez-vous vraiment valider ce choix `,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Valider"
    }).then(result => {
      if (result.value) {
        var body = {
          id: choix.id,
          idstatut: 4,
          statut: 'confirme',
        };
        this.apidb.getList('employecvpossibilitevalide', body).subscribe((choixvalide) => {
          Swal.fire('Succ??s',
            'Nous vous remercions de l\'int??r??t que vous portez ?? notre Etablissement.Pour faire suite ?? l\'??tude de votre' +
            ' dossier de candidature et apr??s examen de vos r??sultats scolaires par le jury d\'admission de l\'ESTEM, ' +
            'nous avons le plaisir de vous annoncer que vous ??tes admis ?? vous inscrire en ' +
            choix.niveau + '??me ann??e <b>' + choix.cible + ' en ' +
            choix.cible2 + ' ' + choix.cible3 + ',</b> pour l???ann??e  Universitaire 2021/2022.', 'success');
          // this.listchoix();
          // this.choixcible();
          this.meschoix();
          this.meschoixvalide();
          // this.checkfairechoix();
          this.action = 4;
          debugger
          this.apidb.addEnregistrement('mail', {
            'fromm': 'ersaliat@ersaliat.net',
            'tom': this.currentEmploye.email,
            'subject': 'vous avez ??t?? enregistrer',
            'bodyhtml': 'Bonjour </br> Nous vous remercions de l\'int??r??t que vous portez ?? notre Etablissement.Pour faire suite ?? l\'??tude de votre' + ' dossier de candidature et apr??s examen de vos r??sultats scolaires par le jury d\'admission de l\'ESTEM, ' + 'nous avons le plaisir de vous annoncer que vous ??tes admis ?? vous inscrire en ' + choix.niveau + '??me ann??e <b>' + choix.cible + ' en ' + choix.cible2 + ' ' + choix.cible3 + ',</b> pour l???ann??e  Universitaire 2021/2022.' + '<p>Pour confirmer votre inscription, il suffit de suivre la proc??dure mentionn??e sur le guide ci-joint, ?? savoir:</p>' + '<p>- 1/  r??gler  les frais d\'inscription et les frais du premier trimestre, voir fiche des tarifs ci-joints,</p>' + '<p>- 2/ Scanner le re??u de paiement et nous l\'envoyer par e-mail pour avoir une copie de l\'attestation d\'inscription,</p>' + '<p>- 3/ Commencer &agrave; pr&eacute;parer le dossier administratif, voir documents demand&eacute;s sur le guide ci-joint.</p>' + '<p>Je reste ?? votre disposition pour tout autre renseignement.</p>' + '<p><br></p>' + '<p>Avec nos f??licitations, nous vous prions d???agr??er nos meilleures salutations.</p>' + '<p><br></p>' + '<p>Cordialement.</p>',
            'idstatus': 1
          }).subscribe((maildata) => {
            console.log(maildata);

          },
            err => {
              console.log(err);
              Swal.fire('Erreur...', 'Erreur d\'envoi d\'email', 'error');
            }
          );
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
          }
        );
      }
    });
  }
  // ---------------------
  Rejeter_choix(choix: any) {
    Swal.fire({
      title: "Rejeter le choix",
      html:
        `Voulez-vous vraiment rejeter ce choix `,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Rejeter"
    }).then(result => {
      if (result.value) {
        var body = {
          id: choix.id,
          idstatut: 1,
          statut: 'propos??',
        };
        this.apidb.getList('employecvpossibilitevalide', body).subscribe((choixvalide) => {
          Swal.fire('Succ??s', 'Choix rejet??', 'success');
          this.listchoix();
          this.choixcible();
          this.meschoix();
          this.meschoixvalide();
          this.checkfairechoix();
          this.action = 2;
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des donn??es', 'error');
          }
        );
      }
    });
  }
  // ---------------------
  select(choix: number) {
    this.action = choix;
  }
}
