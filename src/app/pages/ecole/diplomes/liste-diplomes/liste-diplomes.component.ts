import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/consts';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-diplomes',
  templateUrl: './liste-diplomes.component.html',
  styleUrls: ['./liste-diplomes.component.scss']
})
export class ListeDiplomesComponent implements OnInit {
  public routes: typeof routes = routes;
  displayedColumns: string[] = ['diplome', 'datedebut', 'datefin', 'etablissement', 'pays', 'mention'];
  tablediplome = [];
  dataSource = new MatTableDataSource(this.tablediplome);
  currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  currentEmploye: any = this.Employe[0];
  // ---------------------
  monnom = this.currentEmploye.nom;
  monprenom = this.currentEmploye.prenom;
  mongsm = this.currentEmploye.gsm;
  monemail = this.currentEmploye.email;
  monimage: any;
  constructor(
    public apidb: ApidbService,
  ) { }

  ngOnInit(): void {
    this.apidb.getList('employe', { 'email': this.monemail }).subscribe(
      (dataemploye) => {
        debugger
        this.currentEmploye = dataemploye[0];
        this.apidb
          .getList('getged', {
            contexte: 'CV',
            libelle: 'photo',
            referenceprincipale: this.currentEmploye.id,
            type: 'PHOTO'
          })
          .subscribe((data) => {
            this.monimage = data[0].image;
          }
          );
      },
      err => {
        Swal.fire('Erreur...', err.error.msg, 'error');
      }
    );
    this.lisdiplome();
  }
  lisdiplome() {
    this.apidb.getList('employediplomes', { 'idemploye': this.currentUser.idemploye }).subscribe((datadiplome) => {
      this.tablediplome = datadiplome
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des diplomes', 'error');
      }
    );
  }

}
