import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EcoleRoutingModule } from './ecole-routing.module';
import { InscriptionComponent } from './inscription/inscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';


// ----------------
// ---------------------------
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { AddDiplomeComponent } from './diplomes/add-diplome/add-diplome.component';
import { ListeDiplomesComponent } from './diplomes/liste-diplomes/liste-diplomes.component';
import { ListchoixComponent } from './choix/listchoix/listchoix.component';
import { ListequestionComponent } from './echange/listequestion/listequestion.component';
import { AjouterquestionComponent } from './echange/ajouterquestion/ajouterquestion.component';
import { AjouterecheanceComponent } from './echeance/ajouterecheance/ajouterecheance.component';
import { ListecheancesComponent } from './echeance/listecheances/listecheances.component';
import { ListemployeComponent } from './BO/listemploye/listemploye.component';
import { EtudiantdetailsComponent } from './BO/etudiantdetails/etudiantdetails.component';
// ----------------
@NgModule({
  declarations: [
    InscriptionComponent,
    AddDiplomeComponent,
    ListeDiplomesComponent,
    ListchoixComponent,
    ListequestionComponent,
    AjouterquestionComponent,
    AjouterecheanceComponent,
    ListecheancesComponent,
    ListemployeComponent,
    EtudiantdetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    EcoleRoutingModule,
    // ------------
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSortModule,
    // ------------
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    DatePipe,
  ],
})
export class EcoleModule { }
