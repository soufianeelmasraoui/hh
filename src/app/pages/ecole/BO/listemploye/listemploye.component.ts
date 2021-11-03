import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listemploye',
  templateUrl: './listemploye.component.html',
  styleUrls: ['./listemploye.component.scss']
})
export class ListemployeComponent implements OnInit {

  tableemploye: [] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'gsm', 'email', 'actions'];
  dataSource = new MatTableDataSource(this.tableemploye);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  frmrecherche: FormGroup;
  recherche: any;
  constructor(
    public apidb: ApidbService,
    public router: Router,

  ) {
    this.frmrecherche = new FormGroup({
      recherche: new FormControl(''),
    })
  }

  ngOnInit(): void {
    // this.listemploye();
    this.dataSource.data == null;
  }

  listemploye() {
    // this.apidb.getList('employe','').subscribe((dataemploye) => {}
    this.apidb.getList('employe', {}).subscribe((dataemploye) => {
      this.dataSource.data = dataemploye

    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
      }
    );
  }

  Onchange() {
    // this.apidb.getList('employe','').subscribe((dataemploye) => {}
    var rech = '%' + this.recherche + '%';
    this.apidb.getList('employe', { recherche: rech }).subscribe((dataemploye) => {
      this.dataSource.data = dataemploye
    },
      err => {
        Swal.fire('Erreur', 'Erreur de chargement des données', 'error');
      }
    );
  }

  gotodetails(eleve: any) {
    localStorage.removeItem('findeleve');
    localStorage.setItem('findeleve', eleve);
    this.router.navigate(['BO/detailsetudiant'])
  }
}
