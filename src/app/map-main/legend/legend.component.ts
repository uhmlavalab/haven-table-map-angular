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
  private getBackgroundColor(layer: MapLayer): string {
    return layer.legendColor;
  }

  /** Gets the correct width of the colored background.  Changes depending
   * on whether the legend is vertical or grid.
   * @param active => Is the layer card active or not
   */
  private getWidth(active): object {
    if (this.legendClass === 'vertical') {
      return active ? { width: '70px' } : { width: '0px' };
    } else if (this.legendClass === 'grid') {
      return active ? { width: '50%' } : { width : '0%'};
    }
  }

  /** Gets the correct height of the colored background.  Changes on
   * whether the legend is vertical or grid.
   * @param active => Is the layer card active or not?
   */
  private getHeight(active): object {
    if (this.legendClass === 'vertical') {
      return active ? {height: '70px' } : { height: '0px' };
    } else if (this.legendClass === 'grid') {
      return active ? { height: '100%' } : { height : '0%'};
    }
  }
}
