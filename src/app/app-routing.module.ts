import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingHomeComponent } from '@app/pages';
import { MapMainComponent } from '@app/pages';
import { SecondScreenComponent } from '@app/pages';

const routes: Routes = [
  { path: '', component: LandingHomeComponent },
  { path: 'map-main', component: MapMainComponent },
  { path: 'second-screen', component: SecondScreenComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})

export class AppRoutingModule { }
export const routingComponents = [LandingHomeComponent, MapMainComponent, SecondScreenComponent];
