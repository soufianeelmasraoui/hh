import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './pages/auth/guards';
import { AcceuilComponent } from './pages/acceuil/acceuil.component';

const routes: Routes = [
  {
    path: 'ecole',
    pathMatch: 'full',
    loadChildren: () => import('./pages/ecole/ecole.module').then(m => m.EcoleModule)
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '',
    component: AcceuilComponent
  },
  {
    path: '',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // useHash: true,
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
