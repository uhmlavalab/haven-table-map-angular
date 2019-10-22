import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingHomeComponent } from '@app/sections';
import { MapMainComponent } from '@app/sections';
import { SecondScreenComponent } from '@app/sections';

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
