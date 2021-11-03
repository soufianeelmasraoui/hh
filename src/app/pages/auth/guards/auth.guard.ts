import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { routes } from '../../../consts';
import { ApidbService } from 'src/app/services/apidb.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public routers: typeof routes = routes;

  constructor(private router: Router, private apidb: ApidbService) {
  }
  canActivate(): boolean {
    if (!this.apidb.isAuthenticated() || !this.apidb.isEmploye()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
