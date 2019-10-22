import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { MapMainComponent } from './pages/map-screen/map-main.component';

import { BouncingTitleComponent } from './components/bouncing-title/bouncing-title.component';
import { TextTitleComponent } from './components/text-title/text-title.component';


@NgModule({
  declarations: [
    LandingHomeComponent,
    MapMainComponent,
    TextTitleComponent,
    BouncingTitleComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SectionsModule { }
