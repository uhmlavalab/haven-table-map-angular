import { Component, ViewChildren, AfterViewInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { MapLayer } from '@app/interfaces';
import { LegendDirective } from './legend.directive';
import { chartColors, mapLayerColors } from '../../../assets/plans/defaultColors';
import { _ } from 'underscore';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements AfterViewInit {

  layers: MapLayer[];
  width: number;

  @ViewChildren(LegendDirective) legendElements;

  constructor(private mapdataservice: MapService) {
    this.layers = this.mapdataservice.getLayers();
  }

  ngAfterViewInit() {

  }


  /** Changes the background of a mini-card when that layer is either added or
  * removed from the map.
  * @param layer => The layer that was added or removed.
  */
  getBackgroundColor(layer: MapLayer): string {
    return layer.fillColor;
  }

}
