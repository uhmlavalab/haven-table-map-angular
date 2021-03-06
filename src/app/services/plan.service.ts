import { Injectable } from '@angular/core';
import { _ } from 'underscore';
import { Plan } from '@app/interfaces/plan';
import { Plans } from '../../assets/plans/plans';
import { Scenario, Map, MapLayer } from '@app/interfaces';
import { SoundsService } from './sounds.service';
import { Subject } from 'rxjs';

import * as d3 from 'd3/d3.min';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private state: string;  // Current state of the machine

  private currentMap: Map;                      // Current Map

  private layers: MapLayer[] = [];              // Array Holding All Layers
  private selectedLayer: MapLayer;              // Currently Selected Layer
  public selectedLayerSubject = new Subject<MapLayer>(); // layer publisher
  public toggleLayerSubject = new Subject<MapLayer>();      // Pubisher for when a layer is toggled
  public updateLayerSubject = new Subject<MapLayer>();
  public layerChangeSubject = new Subject<string>();

  private plans: Plan[];                        // Array Holding All Plans
  private currentPlan: Plan;                    // Currently Active Plan
  public planSubject = new Subject<Plan>();     // Plan Publisher

  private scenarios: Scenario[];                // Array Holding All Scenarios
  private currentScenario: Scenario;            // Currently active scenario
  public scenarioSubject = new Subject<Scenario>(); // Scenario publisher

  private currentYear: number;                  // Current year
  public yearSubject = new Subject<number>();   // Year Publisher

  private legendLayouts: string[] = [];         // Array holding possible layouts (grid / vertical)
  private currentLegendLayout: number;          // Currently selected legend layout
  public legendSubject = new Subject<string>(); // Legend Publisher

  /* Reset Subjects */
  public resetLayersSubject = new Subject<any>();

  /* Data Objects */
  private capacityData = {};
  private generationData = {};
  private curtailmentData = {};

  /* Update Timer */
  private UPDATE_DELAY: number = 600;
  private startTime: number;

  constructor(private soundsService: SoundsService) {
    this.plans = Plans;
    this.state = 'landing'; // Initial state is landing
    this.legendLayouts = ['grid', 'vertical'];
    this.currentLegendLayout = 0;
  }

  /** Sets Up the Current Plan
   * @param plan The plan to set up
   */
  public setupSelectedPlan(plan: Plan) {

    this.resetTimer(); // Start the update timer

    this.currentPlan = plan;
    this.currentMap = plan.map;

    // Load layers array with each layer associated with the current map.
    this.currentMap.mapLayers.forEach(layer => {
      if (layer.included) {
        this.layers.push(layer);
      }
    });

    this.selectedLayer = this.layers[0];  // This is the layer that can currently be added/removed.
    this.selectedLayerSubject.next(this.selectedLayer); // Publish current selected layer

    // Publish data for each layer.
    this.scenarioSubject.subscribe(scenario => {
      this.layers.forEach(layer => {
        this.updateLayerSubject.next(layer);
      });
    });

    this.currentYear = this.currentPlan.minYear;  // Begin with the lowest allowed year.
    this.scenarios = this.currentPlan.scenarios;  // Load array with all scenarios associated with this plan
    this.currentScenario = this.scenarios[0];     // Always start with index 0.
    this.planSubject.next(this.currentPlan);      // Publish plan
    this.yearSubject.next(this.currentYear);      // Publish current year
    this.scenarioSubject.next(this.currentScenario); // Publist current scenario

    // Load All Plan Data
    this.getCapacityData();
    //this.getGenerationData();
    this.getCurtailmentData();

    // Change Legend Layout if it is not 'grid'.
    if (this.currentPlan.css.legend.defaultLayout === 'vertical') {
      this.changeCurrentLegendLayout();
    }
  }

  /****************************************************************************************
   * **************************************************************************************
   * ********************* DATA FUNCTIONS *************************************************
   * **************************************************************************************
   * **************************************************************************************
   */

  public getGenerationTotalForCurrentYear(technologies: string[]): number {
    let generationTotal = 0;
    technologies.forEach(tech => {
      this.generationData[this.currentScenario.name][tech].forEach(el => {
        if (el.year === this.currentYear) {
          generationTotal += el.value;
        }
      });
    });
    return generationTotal;
  }

  public getCapacityTotalForCurrentYear(technologies: string[]): number {
    let capacityTotal = 0;
    technologies.forEach(tech => {
      this.capacityData[this.currentScenario.name][tech].forEach(el => {
        if (el.year === this.currentYear) {
          capacityTotal += el.value;
        }
      });
    });
    return capacityTotal;
  }

  public getCurtailmentTotalForCurrentYear(technologies: string[]): number {
    let curtailmentTotal = 0;
    technologies.forEach(tech => {
      this.curtailmentData[this.currentScenario.name][tech].forEach(el => {
        if (el.year === this.currentYear) {
          curtailmentTotal += el.value;
        }
      });
    });
    return curtailmentTotal;
  }

  /** Gets Generation Data
   * 
   */
  public getGenerationData(): Promise<any> {
    this.generationData = {};
    return new Promise((resolve, error) => {
      d3.csv(this.currentPlan.data.generationPath, (data) => {
        data.forEach(element => {
          const year = element.year;
          const technology = element.technology;
          const value = element.value;
          const scenario = element.scenario;
          if (!this.generationData.hasOwnProperty(scenario)) {
            this.generationData[scenario] = {};
          }
          if (!this.generationData[scenario].hasOwnProperty(technology)) {
            this.generationData[scenario][technology] = [];
          }
          this.generationData[scenario][technology].push({ year: Number(year), value: Number(value) });
        });
        return resolve(this.generationData);
      });

    });
  }

  /** Gets Curtailment Data
   * 
   */
  public getCurtailmentData(): Promise<any> {
    this.curtailmentData = {};
    return new Promise((resolve, error) => {
      d3.csv(this.currentPlan.data.curtailmentPath, (data) => {
        data.forEach(element => {
          const year = element.year;
          const technology = element.technology;
          const value = element.value;
          const scenario = element.scenario;
          if (!this.curtailmentData.hasOwnProperty(scenario)) {
            this.curtailmentData[scenario] = {};
          }
          if (!this.curtailmentData[scenario].hasOwnProperty(technology)) {
            this.curtailmentData[scenario][technology] = [];
          }
          this.curtailmentData[scenario][technology].push({ year: Number(year), value: Number(value) });
        });
        return resolve(this.curtailmentData);
      });

    });
  }

  /** Gets Capacity Data */
  public getCapacityData(): Promise<any> {
    return new Promise((resolve, error) => {
      this.capacityData = {};
      d3.csv(this.currentPlan.data.capacityPath, (data) => {
        data.forEach(element => {
          const year = element.year;
          const technology = element.technology;
          const value = element.value;
          const scenario = element.scenario;
          if (!this.capacityData.hasOwnProperty(scenario)) {
            this.capacityData[scenario] = {};
          }
          if (!this.capacityData[scenario].hasOwnProperty(technology)) {
            this.capacityData[scenario][technology] = [];
          }
          this.capacityData[scenario][technology].push({ year: Number(year), value: Number(value) });
        });
        return resolve(this.capacityData);

      });
    });
  }


  /******************* GETTERS AND SETTERS **************/

  /** Gets the currently active plan
   * @return the current plan
   */
  public getCurrentPlan(): Plan {
    return this.currentPlan;
  }

  /** Gets all plans
   * @return array of all plans
   */
  public getPlans(): Plan[] {
    return this.plans;
  }

  /** Gets the current Year
   * @return the current year
   */
  public getCurrentYear(): number {
    return this.currentYear;
  }

  /** Gets the current scenario
   * @return the current scenario
   */
  public getCurrentScenario(): Scenario {
    return this.currentScenario;
  }

  /** Gets all scenarios
   * @return array holding all scenarios
   */
  public getScenarios(): Scenario[] {
    return this.scenarios;
  }

  /** Gets the active layers
   * @return the array of active layers.
   */
  public getLayers(): MapLayer[] {
    return this.layers;
  }

  /** Sets the state of the machine.  Resets the plan when returning to landing.
 * @param state the new machine state.
 */
  public setState(state): void {
    this.state = state;
    if (this.state === 'landing') {
      this.resetPlan();
    }
  }

  /** Gets the state of the machine
   * @return the current state.
   */
  public getState(): string {
    return this.state;
  }

  /************** Data Manipulation Functions *****************
   ************************************************************/

  /** Increments the current year by 1 and plays a sound */
  public incrementCurrentYear(): void {
    try {
      if (this.currentYear < this.currentPlan.maxYear) {
        this.resetTimer();
        this.currentYear++;
        this.soundsService.click();
      }
        this.yearSubject.next(this.currentYear);
      
    } catch (error) {
      // Catch error when setting up
    }
  }

  /** Decrements the current year by 1 and plays a sound */
  public decrementCurrentYear(): void {
    try {
      if (this.currentYear > this.currentPlan.minYear) {
        this.resetTimer();
        this.currentYear--;
        this.soundsService.click();
      }
        this.yearSubject.next(this.currentYear);
    } catch (error) {
      // catch error when setting up
    }

  }

  /** Sets the year to a specific value
   * @param year the year to set
   */
  public setCurrentYear(year): void {
    if (year >= this.currentPlan.minYear && year <= this.currentPlan.maxYear) {
      this.currentYear = year;
    }
    this.yearSubject.next(this.currentYear);
  }

  /** Advances to the next scenario */
  public incrementScenario(): void {
    const index = this.scenarios.indexOf(this.currentScenario) + 1;
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
    this.soundsService.tick();
  }

  /** Goes to the previous scenario */
  public decrementScenario(): void {
    let index = this.scenarios.indexOf(this.currentScenario) - 1;
    if (index === -1) {
      index = this.scenarios.length - 1;
    }
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
    this.soundsService.tick();
  }

  /** Cycles backwards through layers */
  public decrementNextLayer() {
    let index = this.layers.indexOf(this.selectedLayer) - 1;
    if (index === -1) {
      index = this.layers.length - 1;
    }
    this.selectedLayer = this.layers[(index) % this.layers.length];
    this.selectedLayerSubject.next(this.selectedLayer);
    this.layerChangeSubject.next('decrement');
    this.soundsService.tick();

  }

  /** Cycles forwards through layers */
  public incrementNextLayer() {
    const index = this.layers.indexOf(this.selectedLayer) + 1;
    this.selectedLayer = this.layers[(index) % this.layers.length];
    this.selectedLayerSubject.next(this.selectedLayer);
    this.layerChangeSubject.next('increment');
    this.soundsService.tick();
  }

  /** Adds or removes the selected layer after checking it's active state. */
  public toggleLayer(): void {
    this.selectedLayer.active ? this.removeLayer() : this.addLayer();
  }

  /** Adds a layer to the map
   * @return true if successful, false if not.
   */
  public addLayer(): boolean {
    const layer = this.selectedLayer;
    if (!layer.active) {
      layer.active = true;
      this.toggleLayerSubject.next(layer);
      this.soundsService.dropUp();
      return true;
    } else {
      return false;
    }
  }

  /** Removes a layer from the table
   * @return true if successful, false if not
   */
  public removeLayer(): boolean {
    const layer = this.selectedLayer;
    if (layer.active) {
      layer.active = false;
      this.toggleLayerSubject.next(layer);
      this.soundsService.dropDown();
      return true;
    } else {
      return false;
    }
  }

  /** Gets the currently selected layer
   * @return the currently selected layer.
   *    */
  public getSelectedLayer(): MapLayer {
    return this.selectedLayer;
  }

  /** When returning from the main map to the landing, all layer data for the plan 
   * needs to be reset.
   */
  public resetPlan() {
    this.currentPlan.map.mapLayers.forEach(layer => layer.active = false);
    this.currentYear = this.currentPlan.minYear;
    this.yearSubject.next(this.currentYear);
    this.layers = [];
    this.resetLayersSubject.next(this.layers);
  }

  /** Gets the class name of the correct legend css to display.
   * @return the current legend classname
   */
  public getCurrentLegendLayout(): string {
    return this.legendLayouts[this.currentLegendLayout];
  }

  /** Cycles to the next legend css classname.
   * @return the current css class name.
   */
  public changeCurrentLegendLayout() {
    this.currentLegendLayout = (this.currentLegendLayout + 1) % this.legendLayouts.length;
    this.legendSubject.next(this.getCurrentLegendLayout());
  }

  /** Map Construction Functions */
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

  /** Gets the minimum Year
   * @return the minimum year for the plan
   */
  public getMinimumYear(): number {
    return this.currentPlan.minYear;
  }

  /** Gets the maximum Year
   * @return the maximum year for the plan
   */
  public getMaximumYear(): number {
    return this.currentPlan.maxYear;
  }

  private resetTimer(): void {
    const date = new Date();
    this.startTime = date.getTime();
  }

  public okToUpdate(): boolean {
    const currentTime = new Date().getTime();
    if (currentTime - this.startTime > this.UPDATE_DELAY) {
      return true;
    } else {
      return false;
    }
  }
}
