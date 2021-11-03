import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';
import { AjouterquestionComponent } from '../ajouterquestion/ajouterquestion.component';

@Component({
  selector: 'app-listequestion',
  templateUrl: './listequestion.component.html',
  styleUrls: ['./listequestion.component.scss']
})
export class ListequestionComponent implements OnInit {
  displayedColumns: string[] = ['question', 'reponse', 'actions'];
  displayedColumns_question: string[] = ['question', 'reponse'];
  tablequestionsreponses = [];
  // ==============================================
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  // =================== AUTH INFO ===========================
  currentEmploye = this.Employe[0];
  // ==============================================
  frmaddreponse: FormGroup;
  tablequestions: any;
  constructor(
    public apidb: ApidbService,
    private dialog: MatDialog,
  ) {
    this.frmaddreponse = new FormGroup({
      reponse: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.listequestions();
    this.listereponses();
  }

  listequestions() {
    this.apidb.getList('questionreponsequestion', { 'idemploye': this.currentEmploye.id, 'contexte': 'question' }).subscribe((dataquestions) => {
      this.tablequestions = dataquestions
      console.log(dataquestions);
    },
      err => {
        Swal.fire('Erreur', 'Erreur d\'ajout du question', 'error');
      }
    );
  }

  listereponses() {
    this.apidb.getList('questionreponsereponse', { 'idemploye': this.currentEmploye.id, 'contexte': 'question' }).subscribe((dataquestions) => {
      this.tablequestionsreponses = dataquestions
      console.log(dataquestions);
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des questions', 'error');
      }
    );
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
          this.listequestions();
        },
          err => {
            Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
          }
        );
      }
    })
  }

  openaddquestionmodal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    let dialogRef = this.dialog.open(AjouterquestionComponent, dialogConfig);
    dialogRef.afterClosed()
      .subscribe(() => { this.listequestions(); })
  }

}
