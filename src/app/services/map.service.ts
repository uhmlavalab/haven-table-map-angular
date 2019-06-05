import { Injectable } from '@angular/core';
import { _ } from 'underscore';
import { Subject } from 'rxjs';

import { PlanService } from './plan.service';
import { Map, MapLayer } from '@app/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  /* Service Variables */
  private currentMap: Map;
  private layers: MapLayer[] = [];        // Array Holding All Layers

  private selectedLayer: MapLayer;
  public selectedLayerSubject = new Subject<MapLayer>();

  /* Subjects */
  public toggleLayerSubject = new Subject<MapLayer>();      // Pubisher for when a layer is toggled
  public updateLayerSubject = new Subject<MapLayer>();

  constructor(private planService: PlanService) {

    this.planService.planSubject.subscribe(plan => {
      if (plan === null) {
        this.layers = [];
        this.selectedLayer = null;
        this.currentMap = null;
        return;
      }
      this.currentMap = plan.map;
      this.currentMap.mapLayers.forEach(layer => {
        if (layer.included) {
          this.layers.push(layer);
        }
      });
      this.selectedLayer = this.layers[0];
      this.selectedLayerSubject.next(this.selectedLayer);
    });

    this.planService.scenarioSubject.subscribe(scenario => {
      this.layers.forEach(layer => {
        this.updateLayerSubject.next(layer);
      });
    });

    this.planService.yearSubject.subscribe(year => {
      this.layers.forEach(layer => {
        this.updateLayerSubject.next(layer);
      })
    });
  }

  /** Gets the scale of the map
  * @return the scale of the map
  */
  public getMapScale(): number {
    try {
      return this.currentMap.scale;
    } catch (error) {
      console.log('No Map Selected');
      return 0;
    }
    
  }

  /** Gets the map Image width
  * @return the map image width
  */
  public getMapImageWidth(): number {
    try {
      return this.currentMap.width;
    } catch (error) {
      console.log('No Map Selected');
      return 0;
    }
  }

  /** Get the map Image height
  * @return the map Image height
  */
  public getMapImageHeight(): number {
    try {
      return this.currentMap.height;
    } catch (error) {
      console.log('No Map Selected');
      return 0;
    }

  }

  /** Gets the map bounds
  * @return array of bounds.
  */
  public getMapBounds(): any[] {
    try {
      return this.currentMap.bounds;
    } catch (error) {
      console.log('No Map Selected');
      return [];
    }

  }

  /** Gets the map image name
  * @return the path to the map Image
  */
  public getBaseMapPath(): string {
    try {
      return this.currentMap.baseMapPath;
    } catch (error) {
      console.log('No Map Selected');
      return '';
    }
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

  public decrementNextLayer() {
    let index = this.layers.indexOf(this.selectedLayer) - 1;
    if (index === -1) {
      index = this.layers.length - 1;
    }
    this.selectedLayer = this.layers[(index) % this.layers.length];
    this.selectedLayerSubject.next(this.selectedLayer);
  }

  public incrementNextLayer() {
    const index = this.layers.indexOf(this.selectedLayer) + 1;
    this.selectedLayer = this.layers[(index) % this.layers.length];
    this.selectedLayerSubject.next(this.selectedLayer);
  }

  addRemoveLayer() {
    this.toggleLayer(this.selectedLayer);
  }

  resetMap() {

  }

}