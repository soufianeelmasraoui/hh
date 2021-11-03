import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ApidbService } from 'src/app/services/apidb.service';

@Component({
  selector: 'app-ajouterecheance',
  templateUrl: './ajouterecheance.component.html',
  styleUrls: ['./ajouterecheance.component.scss']
})
export class AjouterecheanceComponent implements OnInit {

  AddEcheanceForm: FormGroup;
  // ==============================================
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  // =================== AUTH INFO ===========================
  currentEmploye = this.Employe[0];
  // ==============================================
  constructor(
    public apidb: ApidbService,
    public dialogRef: MatDialogRef<ApidbService>,
    public datepipe: DatePipe
  ) {
    this.AddEcheanceForm = new FormGroup({
      montantechance: new FormControl('', [Validators.required]),
      dateecheance: new FormControl(''),
      datereglementechenace: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  ajouterEcheance() {
    var dateecheancee = this.datepipe.transform(this.AddEcheanceForm.get('dateecheance').value, 'yyyy-MM-dd');
    var datereglementechenace = this.datepipe.transform(this.AddEcheanceForm.get('datereglementechenace').value, 'yyyy-MM-dd');

    this.apidb.addEnregistrement('echeance', {
      'montantechance': this.AddEcheanceForm.get('montantechance').value,
      'dateecheance': dateecheancee,
      'datereglementechenace': datereglementechenace,
      // 'datequestion': Date.now()
    }).subscribe(
      (data) => {
        Swal.fire('Succès...', 'Echeance ajoutée avec succés', 'success');
        this.AddEcheanceForm.reset();
        this.dialogRef.close();
      },
      err => {
        Swal.fire('Erreur...', err.error.msg, 'error');
      }
    );
  }

}
