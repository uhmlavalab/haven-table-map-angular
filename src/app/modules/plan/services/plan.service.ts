import { Injectable } from '@angular/core';
import { _ } from 'underscore';
import { Plan, MapLayer, CSVData, Scenario } from '../interfaces/plan';
import { Subject, BehaviorSubject } from 'rxjs';

import * as d3 from 'd3/d3.min';
import { UserInputService } from '@app/input';
import { SoundsService } from '@app/sounds';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private loadingPlan: boolean;

  private plan: Plan;

  private currentScenario: Scenario;
  public scenarioSubject = new BehaviorSubject<Scenario>(null);

  private currentYear: number;
  public yearSubject = new BehaviorSubject<number>(null);

  private selectedLayer: MapLayer;
  public selectedLayerSubject = new BehaviorSubject<MapLayer>(null);
  public toggleLayerSubject = new Subject<MapLayer>();

  constructor(private inputService: UserInputService, private soundService: SoundsService) { }

  /** Sets Up the Current Plan
   * @param plan The plan to set up
   */
  public setupPlan(plan: Plan) {

    this.loadingPlan = true;
    this.plan = plan;
    const promises = [];

    this.plan.csvData.forEach(el => {
      const promise = this.loadCSVData(el);
      promises.push(promise);
    });

    Promise.all([...promises]).then(() => {
      this.selectedLayer = this.plan.map.mapLayers[0];
      this.selectedLayerSubject.next(this.selectedLayer);

      this.currentYear = this.plan.minYear;
      this.yearSubject.next(this.currentYear);

      this.currentScenario = this.plan.scenarios[0];
      this.scenarioSubject.next(this.currentScenario);
      this.setupInputListeners();
      this.loadingPlan = false;
    });
  }

  private setupInputListeners() {
    this.inputService.incYearSubject.subscribe(() => {
      this.incrementCurrentYear();
    });
    this.inputService.decYearSubject.subscribe(() => {
      this.decrementCurrentYear();
    });
    this.inputService.incScenarioSubject.subscribe(() => {
      this.incrementScenario();
    });
    this.inputService.decScenarioSubject.subscribe(() => {
      this.decrementScenario();
    });
    this.inputService.incMapLayerSubject.subscribe(() => {
      this.incrementNextLayer();
    });
    this.inputService.decMapLayerSubject.subscribe(() => {
      this.decrementNextLayer();
    });
    this.inputService.toggleMapLayerSubject.subscribe(() => {
      this.toggleLayer();
    });

  }

  public loadCSVData(csvObject: CSVData): Promise<CSVData> {
    return new Promise((resolve, error) => {
      d3.csv(csvObject.filePath, (data) => {
        data.forEach(element => {
          csvObject.data.push(element);
        });
        return resolve(csvObject);
      });

    });
  }

  /******************* GETTERS AND SETTERS **************/

  /** Gets the currently active plan
   * @return the current plan
   */
  public getCurrentPlan(): Plan {
    return this.plan;
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
    return this.plan.scenarios;
  }

  /** Gets the all Map layers
   * @return the array of map layers.
   */
  public getLayers(): MapLayer[] {
    return this.plan.map.mapLayers;
  }

  /************** Data Manipulation Functions *****************
   ************************************************************/

  /** Increments the current year by 1 and plays a sound */
  public incrementCurrentYear(): void {
    if (this.currentYear < this.plan.maxYear) {
      this.currentYear++;
      this.yearSubject.next(this.currentYear);
      this.soundService.click();
    }
  }

  /** Decrements the current year by 1 and plays a sound */
  public decrementCurrentYear(): void {
    if (this.currentYear > this.plan.minYear) {
      this.currentYear--;
      this.yearSubject.next(this.currentYear);
      this.soundService.click();
    }
  }

  /** Sets the year to a specific value
   * @param year the year to set
   */
  public setCurrentYear(year): void {
    if (year >= this.plan.minYear && year <= this.plan.maxYear) {
      this.currentYear = year;
      this.yearSubject.next(this.currentYear);
    }
  }

  /** Advances to the next scenario */
  public incrementScenario(): void {
    const index = this.plan.scenarios.indexOf(this.currentScenario) + 1;
    this.currentScenario = this.plan.scenarios[(index) % this.plan.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
    this.soundService.click();
  }

  /** Goes to the previous scenario */
  public decrementScenario(): void {
    let index = this.plan.scenarios.indexOf(this.currentScenario) - 1;
    if (index === -1) {
      index = this.plan.scenarios.length - 1;
    }
    this.currentScenario = this.plan.scenarios[(index) % this.plan.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
    this.soundService.click();
  }

  /** Cycles backwards through layers */
  public decrementNextLayer() {
    let index = this.plan.map.mapLayers.indexOf(this.selectedLayer) - 1;
    if (index === -1) {
      index = this.plan.map.mapLayers.length - 1;
    }
    this.selectedLayer = this.plan.map.mapLayers[(index) % this.plan.map.mapLayers.length];
    this.soundService.click();
    this.selectedLayerSubject.next(this.selectedLayer);
    this.soundService.click();
  }

  /** Cycles forwards through layers */
  public incrementNextLayer() {
    const index = this.plan.map.mapLayers.indexOf(this.selectedLayer) + 1;
    this.selectedLayer = this.plan.map.mapLayers[(index) % this.plan.map.mapLayers.length];
    this.soundService.click();
    this.selectedLayerSubject.next(this.selectedLayer);
    this.soundService.click();
  }

  /** Adds or removes the selected layer after checking it's active state. */
  public toggleLayer(): void {
    this.selectedLayer.active = !this.selectedLayer.active;
    this.toggleLayerSubject.next(this.selectedLayer);
    (this.selectedLayer.active) ? this.soundService.dropUp() : this.soundService.dropDown();
  }

  /** Gets the currently selected layer
   * @return the currently selected layer*
   */
  public getSelectedLayer(): MapLayer {
    return this.selectedLayer;
  }

  /** Gets the map bounds
   * @return array of bounds.
   */
  public getMapBounds(): any[] {
    return this.plan.map.bounds;
  }

  /** Gets the map image name
   * @return the path to the map Image
   */
  public getBaseMapPath(): string {
    try {
      return this.plan.map.baseImagePath;
    } catch (error) {
      console.log('No Map Selected');
      return '';
    }
  }

  /** Gets the minimum Year
   * @return the minimum year for the plan
   */
  public getMinimumYear(): number {
    return this.plan.minYear;
  }

  /** Gets the maximum Year
   * @return the maximum year for the plan
   */
  public getMaximumYear(): number {
    return this.plan.maxYear;
  }

}
