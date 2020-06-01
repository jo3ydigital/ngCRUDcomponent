import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperheroesComponent } from './components/superheroes/superheroes.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/superheroes', pathMatch: 'full' },
  { path: 'superheroes', component: SuperheroesComponent },
  { path: 'about', component: AboutComponent }
  //== DEFAULT
  //{ path: '**', component: NotfoundComponent, data: {title: 'Joey Digital - Error 404'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
