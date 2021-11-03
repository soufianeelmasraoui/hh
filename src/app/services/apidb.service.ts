import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { EnvService } from './env.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ApidbService {
  isLoggedIn = false;
  token: any;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(
    private http: HttpClient,
    private env: EnvService,
    public jwtHelper: JwtHelperService,
    // public storage: Storage,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private refreshliste_sub = new Subject<void>();

  get refreshliste() {
    return this.refreshliste_sub;
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  login(domaine: string, email: string, password: string) {
    return this.http
      .post<any>(this.env.API_URL + 'login', {
        domaine,
        email,
        password
      })
      .pipe(
        tap((user: any) => {
          if (user && user.token) {
            // debugger
            // user.expiresAt = moment().add(user.expiresIn, 'second');
            this.isLoggedIn = true;
            this.currentUserSubject.next(user);
            //user.token="";
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', (user.token));
            const user1 = localStorage.getItem('currentUser');
            return user
          }
        })
      );
  }


  register(nom: string, prenom: string, email: string, gsm: string, domaine: string, radicale: string, prefixe: string) {
    return this.http
      .post<any>(this.env.API_URL + 'employe', {
        nom,
        prenom,
        email,
        gsm,
        domaine,
        radicale,
        prefixe
      })
      .pipe(
        tap((returnObj) => {
          console.log(returnObj);
          return returnObj;
        })
      );
  }

  getpwd() {
    return this.http.get<Element>(this.env.API_URL + 'getpwd').pipe(
      tap((returnObj) => {
        return returnObj;
      })
    );
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.isLoggedIn = false;
    delete this.token;
    this.router.navigate(['/']);
    return null;
    // return this.http.get<any>(this.env.API_URL + 'logout').pipe(
    //   tap((data) => {
    //     return data;
    //   })
    // );
  }

  // user() {
  //   var token = localStorage.getItem('token');
  //   return this.http.post<User>(this.env.API_URL + 'get_user', { "token": token }).pipe(
  //     tap((user) => {
  //       console.log(user);
  //       return user;
  //     })
  //   );
  // }



  getToken() {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      if (currentUser.token != null) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
      return currentUser;
    }
    return null;
  }

  getList(lien, obj) {
    return this.http.put<any>(this.env.API_URL + lien, obj).pipe(
      tap((returnObj) => {
        return returnObj;
      })
    );
  }


  addEnregistrement(lien, obj: any) {
    return this.http.post<any>(this.env.API_URL + lien, obj).pipe(
      tap((returnObj) => {
        console.log(returnObj);
        return returnObj;
      })
    );
  }

  uploadEnregistrement(lien, obj: any, config) {
    return this.http.post<any>(this.env.API_URL + lien, obj, config).pipe(
      tap((returnObj) => {
        console.log(returnObj);
        return returnObj;
      })
    );
  }


  modifierEnregistrement(lien, obj: any) {
    return this.http.put<any>(this.env.API_URL + lien, obj).pipe(
      tap((returnObj) => {
        return returnObj;
      })
    );
  }

  public isAuthenticated(): boolean {
    const token: any = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  public isEmploye(): boolean {
    const emp: any = localStorage.getItem('currentEmploye');
    var currentEmploye: any = JSON.parse(emp);
    if (emp ) {
      return true;
    } else {
      // this.router.navigate(['/']);
      return false;
    }
  }

}
