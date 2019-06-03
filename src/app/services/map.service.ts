import { Injectable } from '@angular/core';
import { _ } from 'underscore';
import { Subject } from 'rxjs';

import { PlanService } from './plan.service';
import { Map, MapLayer, Plan } from '@app/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  /* Service Variables */
  private currentMap: Map;
  private layers: MapLayer[] = [];        // Array Holding All Layers

  /* Subjects */
  public toggleLayerSubject = new Subject<MapLayer>();      // Pubisher for when a layer is toggled

  constructor(private planService: PlanService) {
    this.planService.planSubject.subscribe(plan => {
      this.currentMap = plan.map;
      this.layers = this.currentMap.mapLayers;
      console.log('Plan change in MapService');
    });
    this.planService.scenarioSubject.subscribe(scenario => {
      console.log('Scenario change in MapService');
    });
    this.planService.yearSubject.subscribe(year => {
      console.log('Year change in MapService');
    });
  }

  /** Gets the scale of the map
  * @return the scale of the map
  */
  public getMapScale(): number {
    return this.currentMap.scale;
  }

  /** Gets the map Image width
  * @return the map image width
  */
  public getMapImageWidth(): number {
    return this.currentMap.width;
  }

  /** Get the map Image height
  * @return the map Image height
  */
  public getMapImageHeight(): number {
    return this.currentMap.height;
  }

  /** Gets the map bounds
  * @return array of bounds.
  */
  public getMapBounds(): any[] {
    return this.currentMap.bounds;
  }

  /** Gets the map image name
  * @return the path to the map Image
  */
  public getBaseMapPath(): string {
    return this.currentMap.baseMapPath;
  }

  /** Adds layer if it is inactive, removes layer if it is active */
  public toggleLayer(layer: MapLayer): void {
    const index = this.layers.indexOf(layer);
    if (index !== -1) {
      this.layers[index].active = !this.layers[index].active;
      this.toggleLayerSubject.next(this.layers[index]);
    }
  }

  /** Gets the active layers
  * @return the array of active layers.
  */
  public getLayers(): MapLayer[] {
    return this.layers;
  }

  decrementNextLayer() {
    // TODO
  }
  incrementNextLayer() {
    // TODO
  }
  addRemoveLayer() {

  }

  resetMap() {

  }

}
