import { Injectable } from '@angular/core';
import { Island } from '../interfaces/island';
import { Layer } from '../interfaces/layer';
import { Marker } from '../interfaces/marker';
import { _ } from 'underscore';
import { Subject } from 'rxjs';
import { islands } from '../../assets/defaultData/islands';
import { layers } from '../../assets/defaultData/layers';
import { markers } from '../../assets/defaultData/markers';
import { mapDefaults } from '../../assets/defaultData/mapDefaults';
import { chartColors, mapLayerColors } from '../../assets/defaultData/colors';

@Injectable({
  providedIn: 'root'
})

export class MapDataService {

  /* Service Variables */
  private islands: Island[];  // Array holding all islands
  private selectedIsland: Island; // The island that is selected for main application
  private state: string; // Current state of the machine
  private currentYear: number; // Current year
  private layers: Layer[]; // Array Holding All Layers
  private nextLayer: number; // Index of next layer
  private activeLayers: Layer[] = []; // Array of Active Layers
  private includedLayers: Layer[] = []; // Array of Layers that are included at start
  private markers: Marker[];
  private MAX_YEAR = 2045; // Maximum Year Permitted
  private MIN_YEAR = 2016; // Minimum Year Permitted

  /* Map Settings Variables */
  private mapScale: number;
  private mapImageWidth: number;
  private mapImageHeight: number;
  private bounds: any[];
  private mapImageName: string;

  /* Subjects */
  public yearSubject = new Subject(); // Publisher for year
  public nextLayerSubject = new Subject(); // Publisher for the next Layer to add
  public layerChangeSubject = new Subject(); // Pubisher for when a layer is added or removed

  constructor() {

    this.mapScale = mapDefaults.oahu.scale;
    this.mapImageWidth = mapDefaults.oahu.imageWidth;
    this.mapImageHeight = mapDefaults.oahu.imageHeight;
    this.bounds = mapDefaults.oahu.bounds;
    this.mapImageName = mapDefaults.oahu.imageName;

    this.islands = islands; // Imported from default data
    this.layers = layers; // Imported from default data
    this.markers = markers; // Imported from default data

    this.setCurrentYear(this.MIN_YEAR);
    this.nextLayer = 0;

    // Load activeLayerArray
    this.layers.forEach(layer => this.setLayerColor(layer));
    this.layers.forEach(layer => this.addIncludedLayer(layer));
  }

  /** Gets the array of markers
  * @return the array of Markers
  */
  getMarkers(): Marker[] {
    return this.markers;
  }

  /** Gets the scale of the map
  * @return the scale of the map
  */
  public getMapScale(): number {
    return this.mapScale;
  }

  /** Gets the map Image width
  * @return the map image width
  */
  public getMapImageWidth(): number {
    return this.mapImageWidth;
  }

  /** Get the map Image height
  * @return the map Image height
  */
  public getMapImageHeight(): number {
    return this.mapImageHeight;
  }

  /** Gets the map bounds
  * @return array of bounds.
  */
  public getMapBounds(): any[] {
    return this.bounds;
  }

  /** Gets the map image name
  * @return the path to the map Image
  */
  public getMapImageName(): string {
    return this.mapImageName;
  }

  /** Adds layer if it is inactive, removes layer if it is active */
  public addRemoveLayer(): void {
    if (this.includedLayers[this.nextLayer].active) {
      this.includedLayers[this.nextLayer].active = false;
      this.activeLayers = _.where(this.activeLayers, { active: true });
    } else {
      this.includedLayers[this.nextLayer].active = true;
      this.activeLayers.push(this.includedLayers[this.nextLayer]);
    }
    this.publishLayerChange();
  }

  /* Publishes the layer changes to all subscribers */
  private publishLayerChange(): void {
    this.layerChangeSubject.next(this.layers[this.nextLayer]);
  }

  /** Adds 1 year to the current year
  * @return publish change */
  public incrementCurrentYear(): void {
    if (this.currentYear < this.MAX_YEAR) {
      this.currentYear++;
    }
    this.publishCurrentYear();
  }

  /** Subtracts 1 from the current year
  * @return publish change */
  public decrementCurrentYear(): void {
    if (this.currentYear > this.MIN_YEAR) {
      this.currentYear--;
    }
    this.publishCurrentYear();
  }

  /** Sets the current year
  * @return publis the change */
  public setCurrentYear(year): void {
    if (year >= this.MIN_YEAR && year <= this.MAX_YEAR) {
      this.currentYear = year;
    }
    this.publishCurrentYear();
  }

  /** Publishes the current Year */
  private publishCurrentYear() {
    this.yearSubject.next(this.currentYear);
  }

  /** Gets the current year
  * @return the current year */
  public getCurrentYear(): number {
    return this.currentYear;
  }

  /* Increments the next layer and publishes */
  public incrementNextLayer(): void {
    this.nextLayer = (this.nextLayer + 1) % this.includedLayers.length;
    this.publishNextLayer();
  }

  /** Decrements the next Layer and publishes */
  public decrementNextLayer(): void {
    if (this.nextLayer === 0) {
      this.nextLayer = this.includedLayers.length - 1;
    } else {
      this.nextLayer--;
    }
    this.publishNextLayer();
  }

  /* Publishes the next Layer to all subscribers */
  private publishNextLayer(): void {
    this.nextLayerSubject.next(this.includedLayers[this.nextLayer]);
  }

  /** Gets the data for all islands
  * @return the array of all islands
  */
  public getIslandData(): Island[] {
    return this.islands;
  }

  /** Sets the selected island.
  * @return true iff exactly 1 islands is set to selected
  */
  public setSelectedIsland(): boolean {
    const islandArray = _.filter(this.islands, island => island.selectedIsland);
    if (islandArray.length !== 1) {
      return false;
    } else {
      this.selectedIsland = islandArray[0];
      return true;
    }
  }

  /** Gets the selected Island.
  * @return the selected island
  */
  public getSelectedIsland(): Island {
    return this.selectedIsland;
  }

  /** Gets the array of layers
  * @return array of layers
  */
  public getLayers(): Layer[] {
    return this.layers;
  }

  /** Sets the state of the machine
  * @param state => The new state
  */
  public setState(state): void {
    this.state = state;
  }

  /** Gets the state of the machine
  * @return the current state
  */
  public getState(): string {
    return this.state;
  }

  /** Gets the active layers
  * @return the array of active layers.
  */
  public getIncludedLayers(): Layer[] {
    return this.includedLayers;
  }

  /** Adds a new layer to the list of Included layers
  * @param layer => the layer to add
  * @return true if successful, false if not
  */
  public addIncludedLayer(layer: Layer): boolean {
    let success = true;
    if (_.contains(this.includedLayers, layer)) {
      success = false;
    } else {
      this.includedLayers.push(layer);
    }
    return success;
  }

  /** Removes an included layer from the list of included layers
  * @param layer => the layer to remove
  * @return true if layer removes, false if not found in layers
  */
  public removeIncludedLayer(layer: Layer): boolean {
    let success = true;
    if (_.contains(this.includedLayers, layer)) {
      this.includedLayers = _.reject(this.includedLayers, activeLayer => activeLayer === layer);
    } else {
      success = false;
    }
    return success;
  }

  /** Sets the color for a layer from the default data
  * @param layer => The layer whose color will be set
  */
  public setLayerColor(layer: Layer): void {
    layer.color = mapLayerColors[layer.colorName].legend;
  }

}
