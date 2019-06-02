import { Injectable } from '@angular/core';
import { Island } from '../interfaces/island';
import { Layer } from '../interfaces/layer';
import { Marker } from '../interfaces/marker';
import { Chart } from '../interfaces/chart';
import { Scenario } from '../interfaces/scenario';
import { SoundsService } from './sounds.service';
import { _ } from 'underscore';
import { Subject } from 'rxjs';
import { islands } from '../../assets/defaultData/islands';
import { layers } from '../../assets/defaultData/layers';
import { markers } from '../../assets/defaultData/markers';
import { mapDefaults } from '../../assets/defaultData/mapDefaults';
import { charts } from '../../assets/defaultData/chartDefaults';
import { scenarios } from '../../assets/defaultData/scenarios';
import { chartColors, mapLayerColors } from '../../assets/defaultData/colors';

@Injectable({
  providedIn: 'root'
})

export class MapDataService {

  /* Service Variables */
  private islands: Island[];           // Array holding all islands
  private selectedIsland: Island;      // The island that is selected for main application
  private state: string;               // Current state of the machine
  private currentYear: number;         // Current year
  private layers: Layer[];             // Array Holding All Layers
  private nextLayer: number;           // Index of next layer
  private activeLayers: Layer[] = [];  // Array of Active Layers
  private includedLayers: Layer[] = [];// Array of Layers that are included at start
  private markers: Marker[];           // Array holding all marker data.
  private charts: Chart[] = [];        // Array of charts loaded from default data.
  private currentChart: number;        // Currently displayed chart
  private scenarios: Scenario[] = [];  // Array of scenarios loaded from default data
  private currentScenario: number;     // Currently displayed scenario
  private MAX_YEAR = 2045;             // Maximum Year Permitted
  private MIN_YEAR = 2016;             // Minimum Year Permitted

  /* Map Settings Variables */
  private mapScale: number;
  private mapImageWidth: number;
  private mapImageHeight: number;
  private bounds: any[];
  private mapImageName: string;

  /* Subjects */
  public yearSubject = new Subject();           // Publisher for year
  public nextLayerSubject = new Subject();      // Publisher for the next Layer to add
  public layerChangeSubject = new Subject();    // Pubisher for when a layer is added or removed
  public selectedIslandSubject = new Subject(); // Pubisher for when a layer is added or removed
  public currentChartSubject = new Subject();   // Publisher when chart is changed.
  public currentScenarioSubject = new Subject();// Publisher when scenario is changed

  public test: number;

  constructor(private _soundsservice: SoundsService) {

    this.islands = islands;      // Imported from default data
    this.layers = layers;        // Imported from default data
    this.markers = markers;      // Imported from default data
    this.charts = charts; // Imported from default data
    this.currentChart = 0; // Index of chart array
    this.scenarios = scenarios // Imported from default data
    this.currentScenario = 0; // Index of scenario array

    this.setCurrentYear(this.MIN_YEAR);
    this.nextLayer = 0;

    // Load activeLayerArray
    this.layers.forEach(layer => this.setLayerColor(layer));
    this.layers.forEach(layer => this.addIncludedLayer(layer));

    this.state = 'landing';
  }

  /**
  * Sets up all variables for the selected island.  It is called when user
  * Starts the map from setup.
  */
  setupSelectedIsland(): void {
    this.mapScale = mapDefaults[this.selectedIsland.islandName].scale;
    this.mapImageWidth = mapDefaults[this.selectedIsland.islandName].imageWidth;
    this.mapImageHeight = mapDefaults[this.selectedIsland.islandName].imageHeight;
    this.bounds = mapDefaults[this.selectedIsland.islandName].bounds;
    this.mapImageName = mapDefaults[this.selectedIsland.islandName].imageName;
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

  /** Gets the currently selected Scenario
   * @return the current scenario
   */
  public getCurrentScenarios(): Scenario {
    return this.scenarios[this.currentScenario];
  }

  /** Gets the array of scenarios.
   * @return the array of scenarios
   */
  public getScenarios(): Scenario[] {
    return this.scenarios;
  }

  /** Cycles through the optional scenarios
   * publishes changes to all subscribers.
   */
  public incrementScenario(): void {
    this.currentScenario = (this.currentScenario + 1) % this.scenarios.length;
    this.publishCurrentScenario();
  }

  /** Cycles through the optional scenarios
   * publishes changes to all subscribers.
   */
  public decrementScenario(): void {
    if (this.currentScenario === 0) {
      this.currentScenario = this.scenarios.length - 1;
    } else {
      this.currentScenario--;
    }
    this.publishCurrentScenario();
  }

  /* Publishes the current Scenario to all subscribers */
  private publishCurrentScenario(): void {
    this.currentScenarioSubject.next(this.currentScenario);
  }



  /** Gets the currently selected chart
   * @return the current chart
   */
  public getCurrentChart(): Chart {
    return this.charts[this.currentChart];
  }

  /** Gets the array of charts.
   * @return the array of charts
   */
  public getCharts(): Chart[] {
    return this.charts;
  }

  /** Cycles through the various optional charts
   * publishes changes to all subscribers.
   */
  public incrementChart(): void {
    this.currentChart = (this.currentChart + 1) % this.charts.length;
    this.publishCurrentChart();
  }

/** Cycles through the various optional charts
 * publishes changes to all subscribers.
 */
  public decrementChart(): void {
    if (this.currentChart === 0) {
      this.currentChart = this.charts.length - 1;
    } else {
      this.currentChart--;
    }
    this.publishCurrentChart();
  }

  /* Publishes the current Chart to display to all subscribers */
  private publishCurrentChart(): void {
    this.currentChartSubject.next(this.currentChart);
  }


  /** Adds layer if it is inactive, removes layer if it is active */
  public addRemoveLayer(): void {
    if (this.includedLayers[this.nextLayer].active) {
      this.includedLayers[this.nextLayer].active = false;
      this.activeLayers = _.where(this.activeLayers, { active: true });
      this._soundsservice.dropDown();
    } else {
      this.includedLayers[this.nextLayer].active = true;
      this.activeLayers.push(this.includedLayers[this.nextLayer]);
      this._soundsservice.dropUp();
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
      this._soundsservice.click();
    }
    this.publishCurrentYear();
  }

  /** Subtracts 1 from the current year
  * @return publish change */
  public decrementCurrentYear(): void {
    if (this.currentYear > this.MIN_YEAR) {
      this.currentYear--;
      this._soundsservice.click();
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
    this._soundsservice.tick();
  }

  /** Decrements the next Layer and publishes */
  public decrementNextLayer(): void {
    if (this.nextLayer === 0) {
      this.nextLayer = this.includedLayers.length - 1;
    } else {
      this.nextLayer--;
    }
    this.publishNextLayer();
    this._soundsservice.tick();
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

    this.publishSelectedIsland();
  }

  /** Publishes the selected Island */
  private publishSelectedIsland() {
    this.selectedIslandSubject.next(this.selectedIsland);
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

  /** Resets all layers, elements, and year to original state.  It is called
   *  by placing the year marker into the add/remove section or pressing the
   *  r button on the keyboard.
   */
  public resetMap(): void {
    for (let i = 0; i < this.includedLayers.length; i++) {
      if (this.includedLayers[i].active) {
        this.nextLayer = i;
        this.addRemoveLayer();
      }
    }
    this.setCurrentYear(this.MIN_YEAR);
  }


}
