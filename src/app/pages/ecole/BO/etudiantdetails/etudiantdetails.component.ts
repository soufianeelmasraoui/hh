import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-etudiantdetails',
  templateUrl: './etudiantdetails.component.html',
  styleUrls: ['./etudiantdetails.component.scss']
})
export class EtudiantdetailsComponent implements OnInit {
  eleve: any;
  idemp: any;
  displayedColumns: string[] = ['diplome', 'datedebut', 'datefin', 'etablissement', 'pays', 'mention', 'image', 'image2'];
  displayedColumns_meschoix: string[] = ['cible', 'cible2', 'cible3', 'actions'];
  displayedColumns_choixconfirme: string[] = ['cible', 'cible2', 'cible3', 'actions'];
  displayedColumns_question: string[] = ['question', 'reponse', 'actions'];
  displayedColumns_reponses: string[] = ['question', 'reponse'];
  tablediplome = [];
  action: number;
  tablechoix: any;
  tableechanges: any;
  frmaddreponse: FormGroup;
  AddQuestionForm: FormGroup;
  tableechangesreponses: any;
  addq: number;
  tablechoixconfirme: any;

  constructor(
    public apidb: ApidbService,
    private dialog: MatDialog,
  ) {
    this.AddQuestionForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.find_eleve();
    this.addq = 0;
  }

  find_eleve() {
    var email = localStorage.getItem('findeleve');
    this.apidb.getList('employe', { email: email }).subscribe((dataemploye) => {
      this.eleve = dataemploye[0];
      this.idemp = dataemploye[0].id;
      this.apidb.getList('getged', {
        contexte: 'CV',
        libelle: 'photo',
        referenceprincipale: dataemploye[0].id,
        type: 'PHOTO'
      }
      )
        .subscribe(
          (data) => {
            this.eleve.image = data[0].image;
            this.apidb.getList('employediplomes', { 'idemploye': this.idemp }).subscribe((datadiplome) => {
              this.tablediplome = datadiplome
            },
              err => {
                Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
              }
            );
            // --------------------------
            this.apidb.getList('employecvpossibilite', { 'idemploye': this.idemp, 'idstatut': 2 }).subscribe((datachoix) => {

              this.tablechoix = datachoix
            },
              err => {
                Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
              }
            );
            // --------------------------
            this.apidb.getList('employecvpossibilite', { 'idemploye': this.idemp, 'idstatut': 4 }).subscribe((datachoixconfirme) => {
              this.tablechoixconfirme = datachoixconfirme
            },
              err => {
                Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
              }
            );
            // --------------------------
            this.apidb.getList('questionreponsequestion', { 'idemploye': this.idemp, 'contexte': 'question' }).subscribe((dataechanges) => {
              this.tableechanges = dataechanges
            },
              err => {
                Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
              }
            );
            // --------------------------
            // --------------------------
            this.apidb.getList('questionreponsereponse', { 'idemploye': this.idemp, 'contexte': 'question' }).subscribe((dataechangesreponse) => {
              this.tableechangesreponses = dataechangesreponse
            },
              err => {
                Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
              }
            );
            // --------------------------
          }
        );
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
      }
    );
  }

  // diplomes()
  // {
  //   this.apidb.getList('employediplomes', { 'idemploye': this.idemp }).subscribe((datadiplome) => {
  //
  //     this.tablediplome = datadiplome
  //
  //   },
  //     err => {
  //       Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
  //     }

  //   );
  // }



  Valider_choix(choix: any) {
    Swal.fire({
      title: "Valider le choix",
      html:
        `Voulez-vous vraiment valider ce choix `,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Valider"
    }).then(result => {
      if (result.value) {
        var body = {
          id: choix.id,
          idstatut: 3,
          statut: 'choisi',
        };
        this.apidb.getList('employecvpossibilitevalide', body).subscribe((choixvalide) => {
          Swal.fire('Succès', 'Choix validé', 'success');
          this.apidb.getList('employecvpossibilite', { 'idemploye': this.idemp, 'idstatut': 3 }).subscribe((datachoix) => {

            this.tablechoix = datachoix
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
            }

          );
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
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
          statut: 'proposé',
        };
        this.apidb.getList('employecvpossibilitevalide', body).subscribe((choixvalide) => {
          Swal.fire('Succès', 'Choix rejeté', 'success');
          this.apidb.getList('employecvpossibilite', { 'idemploye': this.idemp, 'idstatut': 1 }).subscribe((datachoix) => {

            this.tablechoix = datachoix
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
            }

          );
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
          }
        );
      }
    });
  }
  // ---------------------


  accepter_choix(choix: any) {
    Swal.fire({
      title: "Accepter le choix",
      html:
        `Voulez-vous vraiment accepter ce choix `,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Accepter"
    }).then(result => {
      if (result.value) {
        var body = {
          id: choix.id,
          idstatut: 5,
          statut: 'accepte',
        };
        this.apidb.getList('employecvpossibilitevalide', body).subscribe((choixvalide) => {
          Swal.fire('Succès', 'Choix accepté', 'success');
          this.apidb.getList('employecvpossibilite', { 'idemploye': this.idemp, 'idstatut': 5 }).subscribe((datachoix) => {
            this.tablechoix = datachoix
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
            }

          );
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
          }
        );
      }
    });
  }
  // ---------------------
  // ---------------------

  select(choix: number) {
    this.action = choix;
  }

  changeadd(add: number) {
    this.addq = add;
  }


  repondre(question: any) {
    var rep = '';
    Swal.fire({
      title: 'Saisir une réponse',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      showLoaderOnConfirm: true,
      preConfirm: (reponse) => {
        if (reponse == null || reponse == "") {
          Swal.showValidationMessage(
            `Réponse obligatoire`
          )
        }
        else {
          rep = `${reponse}`;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        var body = {
          id: question.id,
          reponse: rep,
        };
        this.apidb.modifierEnregistrement('questionreponsevalide', body).subscribe((data) => {
          Swal.fire('Succès', 'Réponse validé avec succès', 'success');
          // --------------------------
          this.apidb.getList('questionreponsequestion', { 'idemploye': this.idemp, 'contexte': 'question' }).subscribe((dataechanges) => {
            this.tableechanges = dataechanges
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
            }
          );
          // --------------------------
          // --------------------------
          this.apidb.getList('questionreponsereponse', { 'idemploye': this.idemp, 'contexte': 'question' }).subscribe((dataechangesreponse) => {
            this.tableechangesreponses = dataechangesreponse
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
            }
          );
          // --------------------------
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
          }
        );
      }
    })
  }


  ajouterQuestionBO() {
    var email = localStorage.getItem('findeleve');
    this.apidb.getList('employe', { email: email }).subscribe((dataemploye) => {
      this.apidb.addEnregistrement('questionreponse', {
        'idemploye': dataemploye[0].id,
        'contexte': 'question',
        'question': this.AddQuestionForm.get('question').value,
      }).subscribe(
        (data) => {
          Swal.fire('Succès...', 'Question ajoutée avec succés', 'success');
          // --------------------------
          this.apidb.getList('questionreponsequestion', { 'idemploye': this.idemp, 'contexte': 'question' }).subscribe((dataechanges) => {
            this.tableechanges = dataechanges
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
            }
          );
          // --------------------------
          // --------------------------
          this.apidb.getList('questionreponsereponse', { 'idemploye': this.idemp, 'contexte': 'question' }).subscribe((dataechangesreponse) => {
            this.tableechangesreponses = dataechangesreponse
          },
            err => {
              Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
            }
          );
          // --------------------------
          this.AddQuestionForm.reset();
        },
        err => {
          Swal.fire('Erreur...', err.error.msg, 'error');
        }
      );
    });
  }

  openimagemodal() {

  }
}
