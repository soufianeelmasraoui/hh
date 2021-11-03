import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajouterquestion',
  templateUrl: './ajouterquestion.component.html',
  styleUrls: ['./ajouterquestion.component.scss']
})
export class AjouterquestionComponent implements OnInit {
  AddQuestionForm: FormGroup;
  // ==============================================
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  // =================== AUTH INFO ===========================
  currentEmploye = this.Employe[0];
  // ==============================================
  constructor(
    public apidb: ApidbService,
    public dialogRef: MatDialogRef<ApidbService>
  ) {
    this.AddQuestionForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {

  }

  ajouterQuestion() {
    var idemploye = this.currentEmploye.id;
    this.apidb.addEnregistrement('questionreponse', {
      'idemploye': idemploye,
      'contexte': 'question',
      'question': this.AddQuestionForm.get('question').value,
      // 'datequestion': Date.now()
    }).subscribe(
      (data) => {
        Swal.fire('Succès...', 'Question ajoutée avec succés', 'success');
        this.AddQuestionForm.reset();
        this.dialogRef.close();
      },
      err => {
        Swal.fire('Erreur...', err.error.msg, 'error');
      }
    );
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
          this.AddQuestionForm.reset();
          this.dialogRef.close();
        },
        err => {
          Swal.fire('Erreur...', err.error.msg, 'error');
        }
      );
    });
  }
}
