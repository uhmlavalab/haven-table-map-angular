import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingHomeComponent } from './landing-home/landing-home.component';
import { MapMainComponent } from './map-main/map-main.component';

const routes: Routes = [
  {path: 'setup', component: LandingHomeComponent},
  {path: 'map-main',component: MapMainComponent}
];

@NgModule ({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})

export class AppRoutingModule { }
export const routingComponents = [LandingHomeComponent, MapMainComponent];
