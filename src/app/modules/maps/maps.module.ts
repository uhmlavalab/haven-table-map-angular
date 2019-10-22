import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { D3MapComponent } from './components/d3-map/d3-map.component';
import { MapLayerLegendComponent } from './components/map-layer-legend/map-layer-legend.component';

@NgModule({
  declarations: [
    D3MapComponent,
    MapLayerLegendComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MapsModule { }
