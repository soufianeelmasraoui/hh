import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApidbService } from 'src/app/services/apidb.service';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent implements OnInit {
  domaines: any = [];
  logo: any;
  domainechoisi: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public loaderinterceptor: LoaderService,
    public apidb: ApidbService,
  ) {
  }

  ngOnInit(): void {
    localStorage.clear();
    this.getdomaine();
  }

  openHome(domaine: any) {
    localStorage.setItem('domaine', JSON.stringify(domaine));
    this.router.navigate(['/login']);
  }

  getdomaine() {
    this.apidb
      .getList('getOrganismes', { domaine: '3UNH5Z5L' })
      .subscribe((estem) => {
        this.domainechoisi = estem[0];
      },
        err => {
          Swal.fire('Erreur...', 'Erreur du chargement d\'application', 'error');
        }
      );
  }
}
