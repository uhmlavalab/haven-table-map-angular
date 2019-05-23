import { Component, ViewChildren, AfterViewInit } from '@angular/core';
import { MapDataService } from '../../services/map-data.service';
import { Layer } from '../../interfaces/layer';
import { LegendDirective } from './legend.directive';
import { chartColors, mapLayerColors } from '../../../assets/defaultData/colors';
import { _ } from 'underscore';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements AfterViewInit {

  layers: Layer[];
  width: number;

  @ViewChildren(LegendDirective) legendElements;

  constructor(private _mapdataservice: MapDataService) {
    this.layers = this._mapdataservice.getLayers();
  }

  ngAfterViewInit() {
    
  }

  /** Changes the background of a mini-card when that layer is either added or
  * removed from the map.
  * @param layer => The layer that was added or removed.
  */
  getBackgroundColor(layer): void {
    return mapLayerColors[layer.colorName].legend;
  }

}
