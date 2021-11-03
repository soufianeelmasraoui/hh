import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards';
import { EtudiantdetailsComponent } from './BO/etudiantdetails/etudiantdetails.component';
import { ListemployeComponent } from './BO/listemploye/listemploye.component';
import { ListchoixComponent } from './choix/listchoix/listchoix.component';
import { AddDiplomeComponent } from './diplomes/add-diplome/add-diplome.component';
import { ListeDiplomesComponent } from './diplomes/liste-diplomes/liste-diplomes.component';
import { ListequestionComponent } from './echange/listequestion/listequestion.component';
import { ListecheancesComponent } from './echeance/listecheances/listecheances.component';
import { InscriptionComponent } from './inscription/inscription.component';

const routes: Routes = [
  {
    path: 'mafiche',
    component: InscriptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'diplomes',
    component: ListeDiplomesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add_diplome',
    component: AddDiplomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'choix',
    component: ListchoixComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'echanges',
    component: ListequestionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'echeances',
    component: ListecheancesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'BO/listeetudiants',
    component: ListemployeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'BO/detailsetudiant',
    component: EtudiantdetailsComponent,
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcoleRoutingModule { }
