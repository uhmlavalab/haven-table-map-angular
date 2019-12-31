import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { MapMainComponent } from './pages/map-main/map-main.component';
import { SecondScreenComponent } from './pages/second-screen/second-screen.component';
import { HecoMainComponent } from './pages/heco-main/heco-main.component';
import { TouchUiComponent } from './pages/heco-main/components/touch-ui/touch-ui.component';

const routes: Routes = [
  { path: '', component: LandingHomeComponent },
  { path: 'map-main', component: MapMainComponent },
  { path: 'second-screen', component: SecondScreenComponent },
  { path: 'heco-main', component: HecoMainComponent },
  { path: 'heco-main/touch-ui', component: TouchUiComponent }
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
export const routingComponents = [LandingHomeComponent, MapMainComponent, SecondScreenComponent, HecoMainComponent, TouchUiComponent];
