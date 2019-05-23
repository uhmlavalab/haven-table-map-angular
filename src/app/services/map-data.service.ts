import { Injectable } from '@angular/core';
import { Island } from '../interfaces/island';
import { Layer } from '../interfaces/layer';
import { Marker } from '../interfaces/marker';
import { _ } from 'underscore';
import { Subject } from 'rxjs';

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

    this.mapScale = 0.237; // Set the map scale
    this.mapImageWidth = 3613;
    this.mapImageHeight = 2794;
    this.bounds = [[-158.281, 21.710], [-157.647, 21.252]];
    this.mapImageName = 'oahu.png';

    // Data for the map cards.
    this.islands = [{
      text: 'Oahu',
      imagePath: './assets/images/landing-images/Oahu.jpg',
      includeSecondScreen: true,
      selectedIsland: false
    }, {
      text: 'Maui',
      imagePath: './assets/images/landing-images/maui.jpg',
      includeSecondScreen: true,
      selectedIsland: false
    }, {
      text: 'Big Island',
      imagePath: './assets/images/landing-images/bigisland.jpg',
      includeSecondScreen: true,
      selectedIsland: false
    }];

    this.layers = [
      {
        name: 'solar',
        displayName: 'Solar Energy',
        colorName: 'Solar',
        active: false
        //  createFn: () => map.addGeoJsonLayer(`../layers/${island}/solar.json`, 'solar', 2020, mapLayerColors.Solar.fill, mapLayerColors.Solar.border, 0.2)
      },
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        colorName: 'Transmission',
        active: false
        //createFn: () => map.addGeoJsonLayer(`../layers/${island}/transmission.json`, 'transmission', null, mapLayerColors.Transmission.fill, mapLayerColors.Transmission.border, 1.0)
      },
      {
        name: 'dod',
        displayName: 'DOD Lands',
        colorName: 'Dod',
        active: false
        //createFn: () => map.addGeoJsonLayer(`../layers/${island}/dod.json`, 'dod', null, mapLayerColors.Dod.fill, mapLayerColors.Dod.border, 0.5)
      },
      {
        name: 'parks',
        displayName: 'Park Lands',
        colorName: 'Parks',
        active: false
        //createFn: () => map.addGeoJsonLayer(`../layers/${island}/parks.json`, 'parks', null, mapLayerColors.Parks.fill, mapLayerColors.Parks.border, 0.5)
      },
      {
        name: 'existing_re',
        displayName: 'Existing Renewables',
        colorName: 'Existing_RE',
        active: false
        //createFn: () => map.addGeoJsonLayer(`../layers/${island}/existing_re_2.json`, 'existing_re', null, mapLayerColors.Existing_RE.fill, mapLayerColors.Existing_RE.border, 0.5)
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        colorName: 'Wind',
        active: false
        //createFn: () => map.addGeoJsonLayer(`../layers/${island}/wind_2.json`, 'wind', 2020, mapLayerColors.Wind.fill, mapLayerColors.Wind.border, 0.25)
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        colorName: 'Agriculture',
        active: false
        //createFn: () => map.addGeoJsonLayer(`../layers/${island}/agriculture.json`, 'agriculture', null, mapLayerColors.Agriculture.fill, mapLayerColors.Agriculture.border, 0.5)
      },
      {
        name: 'ial',
        displayName: 'Important Ag Lands',
        colorName: 'Ial',
        active: false
      }];

      // Data for the Marker setup
      this.markers = [{
        markerId: 0,
        job: 'year',
        icon: ''
      }, {
        markerId: 1,
        job: 'scenario',
        icon: ''
      }, {
        markerId: 2,
        job: 'chart',
        icon: ''
      }, {
        markerId: 3,
        job: 'layer',
        icon: ''
      }];

    this.setCurrentYear(this.MIN_YEAR);
    this.nextLayer = 0;
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
    if (this.layers[this.nextLayer].active) {
      this.layers[this.nextLayer].active = false;
      this.activeLayers = _.where(this.activeLayers, {active: true});
    } else {
      this.layers[this.nextLayer].active = true;
      this.activeLayers.push(this.layers[this.nextLayer]);
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
    this.nextLayer = (this.nextLayer + 1) % this.layers.length;
    this.publishNextLayer();
  }

  /** Decrements the next Layer and publishes */
  public decrementNextLayer(): void {
    if (this.nextLayer === 0) {
      this.nextLayer = this.layers.length - 1;
    } else {
      this.nextLayer--;
    }
    this.publishNextLayer();
  }

  /* Publishes the next Layer to all subscribers */
  private publishNextLayer(): void {
    this.nextLayerSubject.next(this.layers[this.nextLayer]);
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

}
