import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApidbService } from 'src/app/services/apidb.service';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  emailexist: number = 0;
  loginError: String = "";
  // -------------------------
  moncode = localStorage.getItem('code');
  // ----------------
  is_edit: boolean = false;
  password: any;
  // ==============================================
  // ==============================================
  localdomaine: any = JSON.parse(localStorage.getItem('domaine'));
  mondomaine = this.localdomaine.domaine;
  // =================== AUTH INFO ===========================
  constructor(
    private router: Router,
    private apidb: ApidbService,
    public loaderinterceptor: LoaderService
  ) {
    this.form = new FormGroup({
      domaine: new FormControl(this.mondomaine),
      email: new FormControl('', [Validators.required, Validators.email]),
      gsm: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      coder: new FormControl('', [Validators.required]),
      moyencommunication: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // localStorage.removeItem('coder');
    this.apidb.getList('getCode', {}).subscribe(
      (data) => {
        this.password = data[0].code;
      });
    this.reset();
  }



  openLogin() {
    this.router.navigate(['/login'])
  }


  reset() {
    this.apidb.getList('getCode', {}).subscribe(
      (data) => {
        this.moncode = data[0].code;
        this.form.get('coder').reset();
      });
  }
  verifyemail(): boolean {
    var email = this.form.get('email').value;
    if (email != "") {
      this.apidb.getList('employe', { 'email': email }).subscribe((data) => {
        if (data[0] != null) {
          console.log(data);
          this.emailexist = 1;
          return true
        }
        else {
          this.emailexist = 0;
          return true
        }
      })
      this.emailexist = 0;
      return false;
    }
    else {
      this.emailexist = 0;
    }
  }

  registerEmploye(): void {
    this.reset();
    var domaine = this.form.get('domaine').value;
    var email = this.form.get('email').value;
    var gsm = this.form.get('gsm').value;
    var nom = this.form.get('nom').value;
    var prenom = this.form.get('prenom').value;
    var moyencommunication = this.form.get('moyencommunication').value;
    this.apidb.getList('employe', { 'email': email }).subscribe((data) => {
      if (data.length == 0) {
        this.apidb.addEnregistrement('employe', {
          'nom': nom,
          'prenom': prenom,
          'email': email,
          'gsm': gsm,
          'domaine': domaine,
          'coder': this.password,
          'contexte': 'prospect',
          'role': 'prospect',
          'moyencommunication': moyencommunication,
        }).subscribe(
          data => {
            this.apidb.getList('employe', { 'email': email }).subscribe((dataemploye) => {
              console.log(dataemploye[0]);
              debugger
              setTimeout(() => {
                this.apidb.addEnregistrement('registernew', {
                  'nom': dataemploye[0].nom,
                  'prenom': dataemploye[0].prenom,
                  'email': dataemploye[0].email,
                  'gsm': dataemploye[0].gsm,
                  'domaine': dataemploye[0].domaine,
                  'code': this.password,
                  'idemploye': dataemploye[0].id,
                  'contexte': 'prospect',
                  'role': 'prospect',
                  'moyencommunication': moyencommunication,
                }).subscribe(
                  (dataregister) => {
                    console.log(dataregister);
                    debugger
                    this.apidb.addEnregistrement('mail', { 'fromm': 'ersaliat@ersaliat.net', 'tom': dataemploye[0].email, 'subject': 'vous avez été enregistrer ', 'bodyhtml': 'Veuillez saisir le code comme mot de passe ' + this.password, 'idstatus': 1 }).subscribe((maildata) => {
                      Swal.fire('Enregistré avec succès', 'Suite à votre pré-inscription, un email vous a été envoyé avec votre mot de passe pour se connecter et continuer votre candidature.', 'success');
                      this.router.navigate(['/login']);
                    },
                      err => {
                        console.log(err);
                        this.loginError = err.error.msg;
                        Swal.fire('Erreur...', 'Erreur d\'envoi d\'email', 'error');
                      }
                    );
                    console.log(dataemploye);
                  },
                  err => {
                    this.loginError = err.error.msg;
                    Swal.fire('Erreur...', 'error', 'error');
                  }
                );
              }, 2000);
            });
          },
          err => {
            this.loginError = err.error.msg;
            Swal.fire('Erreur...', err.error.msg, 'error');
          }
        );
      }
      else {
        Swal.fire('Erreur...', 'Email existe déja', 'error');
      }
    })
  }



}
