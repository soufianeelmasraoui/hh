import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApidbService } from 'src/app/services/apidb.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  loginForm: FormGroup;
  hide: boolean = false;
  domainechoisi: any;
  donnees: any;
  // ==============================================
  localdomaine: any = JSON.parse(localStorage.getItem('domaine'));
  mondomaine = this.localdomaine.domaine;
  monemail = this.localdomaine.email;
  monpwd = this.localdomaine.pwd;
  // ==============================================
  domaine: any = JSON.parse(localStorage.getItem('domaine'));
  // =================== AUTH INFO ===========================
  constructor(
    private router: Router,
    public apidb: ApidbService,
    public loaderinterceptor: LoaderService
  ) {
    this.loginForm = new FormGroup({
      domaine: new FormControl(this.domaine.domaine, [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // this.apidb.logout();
    this.domainechoisi = this.localdomaine;
  };

  getdomainefilter() {
    this.apidb
      .getList('getOrganismes', { domaine: this.mondomaine })
      .subscribe((estem) => {
        this.domainechoisi = estem[0];
      });
  }

  login(): void {
    var domaine = this.loginForm.get('domaine').value;
    var email = this.loginForm.get('email').value;
    var password = this.loginForm.get('password').value;
    this.apidb.login(domaine, email, password).subscribe(
      (data: any) => {
        this.apidb.getList('employe', { 'email': email }).subscribe(
          (dataemploye) => {
            debugger
            localStorage.setItem('currentEmploye', JSON.stringify(dataemploye));
            if (dataemploye.length == 0) {
              this.router.navigate(['/BO/listeetudiants']);
            }
            else {
              this.router.navigate(['/mafiche']);
            }
          },
          err => {
            Swal.fire('Erreur de connexion ...', 'Vérifier vos coordonées de connexion', 'error');
          }
        );
      },
      err => {
        Swal.fire('Erreur de connexion ...', 'Vérifier vos coordonées de connexion', 'error');
      }
    );
  }

  openRegister() {
    this.apidb.login(this.domaine.domaine, this.domaine.user, this.domaine.pwd).subscribe(
      data => {
        this.router.navigate(['register']);
      },
      err => {
        Swal.fire('Erreur...', err.error.msg, 'error');

      }
    );
  }

  condition(): boolean {
    if (this.domaine.register != "RAS") {
      return true;
    }
    return false
  }
}
