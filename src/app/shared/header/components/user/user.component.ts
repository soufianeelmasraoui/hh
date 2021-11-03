import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApidbService } from 'src/app/services/apidb.service';

import { routes } from '../../../../consts';
import { User } from '../../../../pages/auth/models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  // @Input() user: User;
  user: any = [];
  token: any = localStorage.getItem('token');
  // ==============================================
  Employe: any = JSON.parse(localStorage.getItem('currentEmploye'));
  // =================== AUTH INFO ===========================
  currentEmploye = this.Employe[0];
  // ==============================================
  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();
  constructor
    (
      public apidb: ApidbService
    ) { }

  public routes: typeof routes = routes;
  // public flatlogicEmail: string = "https://flatlogic.com";


  ngOnInit() {
    // this.getuser();
  }

  // getuser(): void {
  //   this.apidb.getList('get_user', { 'token': this.token }).subscribe((data) => {
  //     this.user = data[0];
  //   });
  // }

  // public signOutEmit(): void {
  //   this.signOut.emit();
  // }
}
