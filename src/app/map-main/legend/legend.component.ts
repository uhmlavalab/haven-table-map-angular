import { Component, ViewChildren, AfterViewInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { MapLayer } from '@app/interfaces';
import { LegendDirective } from './legend.directive';
import { chartColors, mapLayerColors } from '../../../assets/plans/defaultColors';
import { _ } from 'underscore';
import { PlanService } from '@app/services/plan.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements AfterViewInit {

  layers: MapLayer[];
  width: number;
  private legendClass: string;

  @ViewChildren(LegendDirective) legendElements;

  constructor(private mapdataservice: MapService, private planService: PlanService) {
    this.layers = this.mapdataservice.getLayers();
    this.legendClass = this.planService.getCurrentLegendLayout();
  }

  ngAfterViewInit() {
    this.planService.legendSubject.subscribe({
      next: value => {
        this.legendClass = value;
      }
    });
  }


  /** Changes the background of a mini-card when that layer is either added or
   * removed from the map.
   * @param layer => The layer that was added or removed.
   */
  getBackgroundColor(layer: MapLayer): string {
    return layer.legendColor;
  }

}
