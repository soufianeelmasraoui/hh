import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';
import { AjouterecheanceComponent } from '../ajouterecheance/ajouterecheance.component';

@Component({
  selector: 'app-listecheances',
  templateUrl: './listecheances.component.html',
  styleUrls: ['./listecheances.component.scss']
})
export class ListecheancesComponent implements OnInit {
  displayedColumns: string[] = ['montantechance', 'dateecheance', 'datereglementechenace', 'actions'];
  tableecheance = [];
  color = 'red'
  constructor(
    public apidb: ApidbService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.listeechance();
  }


  listeechance() {
    this.apidb.getList('echeance', { 'idstatut': 1 }).subscribe((dataecheance) => {
      this.tableecheance = dataecheance
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
      }
    );
  }

  openaddecheancemodal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    let dialogRef = this.dialog.open(AjouterecheanceComponent, dialogConfig);
    dialogRef.afterClosed()
      .subscribe(() => { this.listeechance(); })
  }

}
